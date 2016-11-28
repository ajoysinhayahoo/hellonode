/**
 * 
 */
var http = require('http');
var mongoose = require('mongoose');
var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var property = require('../dao/property');
var fs = require('fs');

var Grid = require('gridfs-stream');
var gfs;



var schemas = require('../schema/profilepicture_schema');

console.log("property.url" + property.url);

mongoose.connect(property.url);

// connection events:
// we can use the mongoose api to hook into events e.g. when connecting /
// disconnecting to MongoDB
mongoose.connection.on('connected', function() {
	console.log('Connected to url: ' + property.url);
});
mongoose.connection.on('error', function(err) {
	console.log('Connection error: ' + err);
});

mongoose.connection.once('open',function() {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
});

// Default Objects
var responseObj = new schemas.ResponseObj({
	data : null,
	statusCode : "404",
	statusMsg : "DEFAULT ERROR"
});

// create application/json parser
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({
	extended : true
}));


module.exports.uploadImage = function(file, callback) {
	
	var writeStream = gfs.createWriteStream();

    fs.createReadStream(file.path).pipe(writeStream);

    writeStream.on('close', function(file) {
    	console.log(' File ID to  ' + file._id);
    	console.log(" File is within dao  "+file);
    	callback(null, file);
    	
    });
    writeStream.on('error', function(e) {
    	console.log("Could not upload file");
    	callback(e, null);
    });
    
    
	
}

module.exports.getImage = function(fileid,req,res) {
	
	 gfs = Grid(mongoose.connection.db, mongoose.mongo);
	 
	 console.log(" fileid "+fileid);
	 
	 gfs.findOne({ _id: fileid}, function(err, file) {
	      if(err) {
	    	  console.log("Error Occured !!!");	    	  
	      } else if(!file){
	    	  console.log("Error File not found !!!");	
	      } else {
	          var readstream = gfs.createReadStream({
	            _id: file._id
	          });

	          console.log("readstream is "+readstream);	
	          console.log("readstream is "+file.contentType);	
	          
	          res.set('Content-Type', file.contentType);

	          readstream.on('error', function (err) {
	        	  console.log("Error on file read");	
	          });
	          readstream.on('open', function () {
	              readstream.pipe(res);
	          });
	      }
	  });
	
}



module.exports.addNewQuestion = function(question_obj, callback) {
	question_obj.save(screen_obj,callback);
}


