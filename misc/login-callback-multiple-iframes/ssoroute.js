const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {

    const ssoConfig = {
        userDataJSONBase64: null,
        verificationHash: null,
        timestamp: Date.now(),
    };

    res.send({
        ssoConfig
    })
});

module.exports = router;
