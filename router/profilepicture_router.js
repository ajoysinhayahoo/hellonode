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

//var upload = multer({dest : './uploads/'});

var AWS = require('aws-sdk');

var s3 = new AWS.S3();
 
var done = false;
var resultObj = "";
var fileid = "";

var multer = require('multer')

var storage = multer.diskStorage({
	
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        console.log(file);
        callback(null, file.originalname)
    }
});
 
var upload = multer({
	storage: storage,
});



module.exports = function(app) {
 
	var controller = require("../controller/profilepicture_controller");

	app.use(bodyParser.json({
		extended : false
	}));
	app.use(bodyParser.urlencoded({
		extended : false
	}))

	 
	app.post('/api/photo', upload.single('file'), function(req, res) {
		
	    console.log(req.body) // form fields
	    console.log(req.file) // form files
	    
	    var file = req.file;
	    
	    var params = {
		      Bucket: 'profilepicturefornodeapp',
		      Key: req.body.username + "/"+file.originalname,
		      Body: fs.readFileSync(file.path),
		      ACL:'public-read'
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
		
		 
	});

	app.get('/findimage/:id', cors(), function(req, res) {
		var fileid = req.params.id;
		controller.getImage(fileid, req, res);

	});
	
	app.get('/deleteImage/:userid/:key', cors(), function(req, res) {
		var key = req.params.key;
		var userid = req.params.userid;
		var filefullpath = userid + "/"+key; 
		var deleteParam = {
		        Bucket: 'profilepicturefornodeapp',
		        Delete: {
		            Objects: [{Key: filefullpath}]
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