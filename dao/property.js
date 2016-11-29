/**
 * 
 */

var formatterUrl = "";
console.log(" >>> "+process.env.OPENSHIFT_MONGODB_DB_URL);
//if OPENSHIFT env variables are present, use the available connection info:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
	formatterUrl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
} else {
	formatterUrl = 'mongodb://127.0.0.1:27017/profileimagebank';
}

module.exports = {
		url : formatterUrl
}
