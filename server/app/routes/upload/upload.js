'use strict';
const router = require('express').Router();
const S3FS = require('s3fs');
const fs = require('fs');
const env = require('../../../env');
const s3fsImpl = new S3FS('graphitiDatasets', {
	accessKeyId: env.amazonaws.accessKeyId,
	secretAccessKey: env.amazonaws.secretAccessKey
});
const Converter = require('csvtojson').Converter;

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

s3fsImpl.create();

router.use('/', multipartMiddleware);

router.post('/', function (req, res, next) {
	//check to make sure file is .csv or .json
	//use Date.now() to give a unique file path??
	const csvConverter = new Converter({});

	if (!req.files) {
		res.send('No files were uploaded.');
	}
	let uploadedFile = req.files.file;
	let stream = fs.createReadStream(uploadedFile.path);

	req.session.uploadedFile = uploadedFile;
	req.session.stream = stream;
	
	csvConverter.on('end_parsed', function (jsonArray) {
		let trimmedFile = uploadedFile.originalFilename.replace(/.csv/, "");
		res.send({fileName: trimmedFile, data: jsonArray, dataset: {name: trimmedFile}});
	});
	stream.pipe(csvConverter);
	csvConverter.on('error', function (errMsg, errData) {
		next(errMsg);
	});
});

module.exports = router;
