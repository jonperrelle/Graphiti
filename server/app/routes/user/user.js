'use strict';
const router = require('express').Router();
const S3FS = require('s3fs');
const fs = require('fs');
const env = require('../../../env');
const db = require('../../../db');
const User = db.model('user');
const Dataset = db.model('dataset');
const AWS = require('aws-sdk');

AWS.config.update( {
    accessKeyId: env.amazonaws.accessKeyId,
    secretAccessKey: env.amazonaws.secretAccessKey
})
AWS.config.setPromisesDependency(require('bluebird'));


// const s3 = new AWS.S3();

// const s3fsImpl = new S3FS('graphitiDatasets', {
//     accessKeyId: env.amazonaws.accessKeyId,
//     secretAccessKey: env.amazonaws.secretAccessKey
// });

// s3fsImpl.create();



router.post('/:userId/addSocrataDataset', function(req, res, next) {

    User.findById(req.params.userId)
        .then(function(user) {
            var ds = {
                userUploaded: false,
                socrataId: req.body.dataset.id,
                socrataDomain: req.body.domain
            }
            return Dataset.findOrCreate({ where: ds })
                .spread(function(ds, bool) {
                    return user.addDataset(ds)
                })
                .catch(next)
        })
        .then(function() {
            res.sendStatus(201);
        })
        .catch(next);
})

let Etag;

router.post('/:userId/addUploadedDataset', function(req, res, next) {

	let stream = fs.createReadStream(req.session.uploadedFile.path);

    return s3fsImpl.writeFile(req.session.uploadedFile.originalFilename, stream)
        .then(function(what) {
        	Etag = what;

            return fs.unlink(req.session.uploadedFile.path, function(err) {
                if (err) next(err);
            });
        })
        .then(function() {
            res.sendStatus(201);
        });
});

router.get('/:userId/awsDataset',function(req,res,next){

	// s3fsImpl.listContents(req.session.uploadedFile.originalFilename)
	// 	.then(function(obj) {
	// 		console.log(obj);
	// 		res.sendStatus(200);
	// 	})
	// 	.catch(next)

	console.log(Etag);

	s3.getObject({Bucket: 'graphitiDatasets', Key: req.session.uploadedFile.originalFilename },function(err, data){
		if(err) next(err);
		else console.log(data);
		res.sendStatus(201);
	})

});

module.exports = router;
