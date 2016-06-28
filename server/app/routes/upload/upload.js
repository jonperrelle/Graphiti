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
const csvConverter = new Converter({});


const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

s3fsImpl.create();

router.use('/', multipartMiddleware);

router.post('/', function (req, res, next) {
	//check to make sure file is .csv or .json
	//use Date.now() to give a unique file path??
	if (!req.files) {
		res.send('No files were uploaded.');
	}
	let uploadedFile = req.files.file;
	let stream = fs.createReadStream(uploadedFile.path);
	csvConverter.on('end_parsed', function (jsonArray) {
		res.send({fileName: uploadedFile.originalFilename, data: jsonArray});
	});
	stream.pipe(csvConverter);
	// return s3fsImpl.writeFile(uploadedFile.originalFilename, stream)
	// 		.then(function() {
	// 			return fs.unlink(uploadedFile.path, function (err) {
	// 				if (err) next(err);
	// 			});
	// 		})
	// 		.then(function() {
	// 			res.send();
	// 		});
});

module.exports = router;
