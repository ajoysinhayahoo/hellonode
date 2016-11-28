/**
 * 
 */

var mongoose = require('mongoose');
var property = require('../dao/property');
var autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(property.url);

autoIncrement.initialize(connection);

var Schema = mongoose.Schema;
//Create a schema for Space

var responseSchema = new Schema({
	data: Object,
	statusCode: String,
	statusMsg: String
});

 

//Create a model for Space
var ResponseObj = mongoose.model('ResponseObj', responseSchema);
 
//expose the schema
module.exports = {
		ResponseObj:ResponseObj
};

