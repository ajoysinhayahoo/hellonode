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
var ApiResponse = require("../util/ApiResponse.js");
var gfs;

var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAI6GI4VKS3WUCGHFQ',
    secretAccessKey: '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'
});

var s3 = new AWS.S3();

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
			//return filename + Date.now();
			return filename;
		},
		onFileUploadStart : function(file, req, res) {
			console.log(' 2  ');
			console.log(file.originalname + ' is starting ...')
		},
		onFileUploadData: function (file, data, req, res) {
		    // file : { fieldname, originalname, name, encoding, mimetype, path, extension, size, truncated, buffer }
		    var params = {
		      Bucket: 'profilepicturefornodeapp',
		      Key: file.name,
		      Body: data
		    };

		    s3.putObject(params, function (perr, pres) {
		      if (perr) {
		        console.log("Error uploading data: ", perr);
		        var response = new ApiResponse({
					success : false,
					extras : file
				});
				fs.unlink(file.path);
				res.end(JSON.stringify(response));
		      } else {
		        console.log("Successfully uploaded data to myBucket/myKey"+pres);
		        console.log("Successfully uploaded data to myBucket/myKey"+ JSON.stringify(pres));
		        var response = new ApiResponse({
					success : true,
					extras : file
				});
				fs.unlink(file.path);
				res.end(JSON.stringify(response));
		      }
		    });
		}/*,
		onFileUploadComplete : function(file, req, res) {
			console.log(' 3  file path '+file.path);
			var response = new ApiResponse({
				success : true,
				extras : file
			});
			fs.unlink(file.path);
			res.end(JSON.stringify(response));
			controller.uploadfile(file, function(status, result) {
				done = true;
				fs.unlink(file.path);
				res.end(JSON.stringify(result));
			});
			
			
			 
		}*/
	}));

	app.post('/api/photo', cors(), function(req, res) {
		console.log("body ", req.body) // form fields
		console.log("files ", req.files) // form files
		upload(req, res, function(err) {
			console.log(' 1  ');
			console.log("err ", err) // form fields
			if (err) {
				return res.end("Error uploading file.");
			}
		});
	});

	app.get('/findimage/:id', cors(), function(req, res) {
		var fileid = req.params.id;
		controller.getImage(fileid, req, res);

	});
	
	app.get('/deleteImage/:key', cors(), function(req, res) {
		var key = req.params.key;
		var deleteParam = {
		        Bucket: 'profilepicturefornodeapp',
		        Delete: {
		            Objects: [{Key: key}]
		        }
		}; 
		s3.deleteObjects(deleteParam, function(err, data) {
	        if (err) console.log(err, err.stack);
	        else console.log('delete', data);
	    });
		//controller.getImage(fileid, req, res);

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