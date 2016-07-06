'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/soda',require('./soda/soda.router.js'));
router.use('/upload',require('./upload/upload.js'));
router.use('/users',require('./user/user.js'));

router.use(function (req, res) {
    res.status(404).end();
});
