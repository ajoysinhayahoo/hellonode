/**
 * 
 */

var http = require('http');
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var Grid = require('gridfs-stream');
var mongoose = require('mongoose');
var gfs;

var upload = multer({
	dest : './uploads/'
});


var done = false;
var resultObj = "";
var fileid = "";

module.exports = function(app) {

	var controller = require("../controller/profilepicture_controller");

	app.use(bodyParser.json({
		extended : false
	}));
	app.use(bodyParser.urlencoded({
		extended : false
	}))

	app.use(multer({
		dest : './uploads/',
		rename : function(fieldname, filename) {
			return filename + Date.now();
		},
		onFileUploadStart : function(file, req, res) {
			console.log(' 2  ');
			console.log(file.originalname + ' is starting ...')
		},
		onFileUploadComplete : function(file, req, res) {
			console.log(' 3  ');
			controller.uploadfile(file, function(status, result) {
				done = true;
				res.end(JSON.stringify(result));
			});

		}
	}));

	app.post('/api/photo', cors(), function(req, res) {
		console.log("body ",req.body) // form fields
	    console.log("files ",req.files) // form files
		upload(req, res, function(err) {
			console.log(' 1  ');
			console.log("err ",err) // form fields
			if (err) {
				return res.end("Error uploading file.");
			}
		});
	});

	app.get('/findimage/:id', cors(), function(req, res) {
		var fileid = req.params.id;
		controller.getImage(fileid, req, res);

	});
	
	app.get('/', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.send(fs.readFileSync('./profilepicturemanager/imageupload.html'));
	});

}

var responsetoBrowser = function(req, res, url) {
	res.writeHead(200, {
		"Content-Type" : "text/html"
	});
	res.write(fs.readFileSync(url));
	res.end();
}