const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const exec = require('child_process').exec;
const path = require('path');
const fs = require('fs');
const os = require('os');

var app = express();
app.use(cors());
app.use(fileUpload({
	safeFileNames: /(\s+|\W+)/g,
	preserveExtension: 4,
	createParentPath: true
}));

app.get('/oledrop*', function (req, res) {
	var appdir = __dirname + "/app/";
	if(req.params[0].trim().length === 0){
		res.sendFile('/oledrop.html', {root: appdir});
	}else{
		res.sendFile(req.params[0], {root: appdir});
	}
});

app.get('/', function (req, res) {
	res.redirect(302, '/oledrop');
});

//https://www.w3jar.com/node-file-upload-with-express-js/
app.post('/oledrop', function (req, res) {
	//console.log("[+] A post request was received by /oledrop");
	
	let resData = [];
	if (!req.files || Object.keys(req.files).length === 0) {
		resData.push({
			'error':'NoFile',
			'message':'oledrop did not receive a file'
		});
		return res.setHeader('Content-Type', 'application/json')
		.status(400)
		.send(JSON.stringify(resData));
	}

	let platform = os.platform();
	let file = req.files.drop;
	let tmpPath = path.join(__dirname, "app", "tmp", file.name);
	let olePath = "";
	if(/linux/.test(platform)){
		olePath = path.join(__dirname, "oletools-venv", "bin", "activate");
	}else if(/^win/.test(platform)){
		olePath = path.join(__dirname, "oletools-venv", "Scripts");
	}else{
		resData.push({
			'error':'PlatformError',
			'message':'oledrop cannot run on platform ' + platform
		});
		return res.setHeader('Content-Type', 'application/json')
		.status(400)
		.send(JSON.stringify(resData));
	}

	const analyze = new Promise( (resolve, reject) => {
		file.mv(tmpPath);
		let cmd = "";
		if(/linux/.test(platform)){
			cmd = `source ${olePath} && olevba -j ${tmpPath} && deactivate && cd ${__dirname}`;
		}else{
			cmd = `cd ${olePath} && activate && olevba -j ${tmpPath} && deactivate`;
		}
		exec(cmd, (err, stdout, stderr) => {
			if (err) {
				reject(err);
			}else{
				resolve(stdout);
			}
		});
	});

	analyze
	.then(results => {
		fs.unlink(tmpPath, (err) => {
			if(err) throw err;
		});
		res.setHeader('Content-Type', 'application/json')
		.status(200)
		.send(results);
	})
	.catch(err => {
		resData.push({
			'error':'500',
			'message':err.message
		});
		res.setHeader('Content-Type', 'application/json')
		.status(500)
		.send(JSON.stringify(resData));
	});
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log(`oledrop listening on port ${port}`);
});
