'use strict';
const router = require('express').Router();
// const fileUpload = require('express-fileupload');
const multiparty = require('multiparty');

module.exports = router;


router.post('/', function(req, res, next) {

	var form = new multiparty.Form();
	form.on("part", function(part){
        if(part.filename) {
            var FormData = require("form-data");
            var request = require("request");
            var form = new FormData();

            form.append("file", part, {filename: part.filename, contentType: part["content-type"]});

            // var r = request.post("http://localhost:7070/store", { "headers": {"transfer-encoding": "chunked"} }, function(err, res, body){ 
            //     res.send(res);
            // });
            
            // r._form = form
            res.send('File Uploaded')
        }
    });

    form.on("error", next);

    form.parse(req);
		
});


// router.use(fileUpload());

// router.post('/',function(req,res,next){

// 	let sampleFile;
 

// 	if (!req.files) {
// 		res.send('No files were uploaded.');
// 	}
// 	sampleFile = req.files.file;
// 	sampleFile.mv(__dirname + '/worldbank.csv', function(err) {
// 		if (err) {
// 			next(err);
// 		}
// 		else {
// 			res.send('File uploaded!');
// 		}
// 	});
   
// });




















