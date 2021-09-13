var express = require("express");
var app = express();
const fs = require('fs');
const cors = require('cors');
app.use(cors());

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
	console.log("A post request was received by /oledrop");
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log("oledrop listening at http://%s:%s", host, port);
});
