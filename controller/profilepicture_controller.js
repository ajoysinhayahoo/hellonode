/**
 * 
 */

var dao = require("../dao/profilepicture_dao");
var ApiResponse = require("../util/ApiResponse.js");
var express = require('express');
var http = require('http');
var connect = require("connect");
var fs = require('fs');
var schemas = require('../schema/profilepicture_schema');
var autoIncrement = require('mongoose-auto-increment');


module.exports.uploadfile = function(file, callback) {
	dao.uploadImage(file, function(err, obj) {

		if (err) {
			console.log("err " + err);
			return callback(err, new ApiResponse({
				success : false,
				extras : "Error is here"
			}));
		} else {
			console.log("File uploaded Saved Successfully ");
			console.log(" File is  " + obj);
			console.log(" File id is  " + obj._id);
			return callback(err, new ApiResponse({
				success : true,
				extras : obj
			}));
		}

	});
}

module.exports.getImage = function(fileid, req, res) {
	dao.getImage(fileid, req, res);
}







