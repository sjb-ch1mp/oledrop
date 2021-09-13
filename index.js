const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const cors = require('cors');

var app = express();
app.use(cors());
app.use(fileUpload({
	safeFileNames: /(\s+|\W+)/g,
	preserveExtension: 4,
	createParentPath: true,
	useTempFiles: true,
	tempFileDir: __dirname + "/app/tmp/"
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

app.post('/oledrop', function (req, res) {
	console.log("[+] A post request was received by /oledrop");
	if (!req.files || Object.keys(req.files).length === 0) {
		let data = {
			'error':'NoFile',
			'message':'oledrop did not receive a file'
		};
		res.setHeader('Content-Type', 'application/json');
		res.status(400).send(JSON.stringify(data));
	}

	let file = req.files.drop;
	console.log("|__ oledrop received file: " + file.name);
	let data = {
		'error':'UploadSuccess',
		'message':'oledrop successfully received file ' + file.name
	}
	res.setHeader('Content-Type', 'application/json');
	res.status(200).send(JSON.stringify(data));
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log("oledrop listening at http://localhost:%s", port);
});
