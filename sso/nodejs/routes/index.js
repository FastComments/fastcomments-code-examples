const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const API_SECRET = 'DEMO_API_SECRET'; // Replace this with your own in production! This will only work with the "demo" tenant id.

router.get('/', function (req, res, next) {
    // Create the user object from your database.
    const someUser = {
        id: 'some-user-id',
        email: 'someguy@someplace.com',
        username: 'some-username',
        avatar: 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        optedInNotifications: true,
        displayLabel: 'VIP User',
        websiteUrl: null // You can set this to a link to the user's account page, or maybe their own website.
    };

    const userDataJSON = JSON.stringify(someUser);
    const userDataJSONBase64 = Buffer.from(userDataJSON).toString('base64');

    const now = Date.now();
    const verificationHash = crypto
        .createHmac('sha256', API_SECRET)
        .update(now + userDataJSONBase64)
        .digest('hex');

    const ssoConfig = {
        userDataJSONBase64: req.query.logout === 'true' ? null : userDataJSONBase64, // implement your own login/out mechanism.
        verificationHash: req.query.logout === 'true' ? null : verificationHash,
        timestamp: now,
        logoutURL: '/?logout=true',
        loginURL: '/'
    };

    res.render('index.ejs', {
        title: 'FastComments SSO Demo',
        ssoConfig: ssoConfig,
        urlId: '/' // We only hard code the url-id since our logout url has query params that would change the page URL. You probably don't need to do this.
    });
});

module.exports = router;
