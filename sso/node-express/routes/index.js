const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const API_SECRET = 'DEMO_API_SECRET'; // Replace this with your own in production! This will only work with the "demo" tenant id.
const TENANT_ID = 'demo'; // REPLACE THIS WITH YOUR TENANT ID

function getSSOConfig(req) {
    // Create the user object from your database.
    const someUser = {
        id: '1',
        email: 'someone@somewhere.com',
        username: 'someone',
        displayName: 'Some Username',
        avatar: 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        optedInNotifications: true,
        displayLabel: 'VIP User',
        websiteUrl: null, // You can set this to a link to the user's account page, or maybe their own website.
        isAdmin: false,
        isModerator: false
    };

    const userDataJSON = JSON.stringify(someUser);
    const userDataJSONBase64 = Buffer.from(userDataJSON).toString('base64');

    const now = Date.now();
    const verificationHash = crypto
        .createHmac('sha256', API_SECRET)
        .update(now + userDataJSONBase64)
        .digest('hex');

    return {
        userDataJSONBase64: req.query.logout === 'true' ? null : userDataJSONBase64, // implement your own login/out mechanism.
        verificationHash: req.query.logout === 'true' ? null : verificationHash,
        timestamp: now,
        logoutURL: '/?logout=true',
        loginURL: '/'
    };
}

// server-side rendering example
router.get('/', function (req, res, next) {
    res.render('index.ejs', {
        TENANT_ID,
        title: 'FastComments SSO Demo',
        ssoConfig: getSSOConfig(req),
        urlId: 'some-page-id-or-url' // We only hard code the url-id since our logout url has query params that would change the page URL. You probably don't need to do this.
    });
});

// REST API example
router.get('/sso-user-info', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.headers['origin']);
    res.set('Access-Control-Allow-Credentials', 'true');
    res.send(getSSOConfig(req));
});
router.options('/sso-user-info', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.headers['origin']);
    res.set('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
});

module.exports = router;
