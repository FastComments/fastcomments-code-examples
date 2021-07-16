const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.render('top-frame');
});

router.get('/middle-frame', function (req, res) {
    res.render('middle-frame');
});

module.exports = router;
