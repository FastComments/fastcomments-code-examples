import base64
import hashlib
import hmac
import json as simplejson
import time

FASTCOMMENTS_API_SECRET = 'DEMO_API_SECRET'; # Replace this with your own in production! This will only work with the "demo" tenant id.
FASTCOMMENTS_TENANT_ID = 'demo'; # Replace this with your own in production!

# The return value of this function can be passed directly to the comment widget.
def getFastCommentsConfigWithSecureSSOPayload(isLoggedIn):
    user_data = {
        'id': 'some-user-id',
        'email': 'someone@someplace.com',
        'username': 'some-username',
        'displayName': 'Some Username',
        'avatar': 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        'optedInNotifications': true,
        'displayLabel': 'VIP User',
        'websiteUrl': null, # You can set this to a link to the user's account page, or maybe their own website.
        'isAdmin': false,
        'isModerator': false
    } if isLoggedIn

    data = simplejson.dumps(user_data)
    # encode the data to base64
    userDataJSONBase64 = base64.b64encode(data)
    # generate a timestamp for signing the message
    timestamp = int(time.time()*1000)
    # generate our hmac signature
    verificationHash = hmac.HMAC(FASTCOMMENTS_API_SECRET, str(timestamp) + userDataJSONBase64, hashlib.sha256).hexdigest()

    return simplejson.dumps({
        tenantId: FASTCOMMENTS_TENANT_ID,
        urlId: '/',
        sso: {
            'userDataJSONBase64': userDataJSONBase64 if isLoggedIn else null, # implement your own login/out mechanism.
            'verificationHash': verificationHash if isLoggedIn else null,
            'timestamp': now,
            'logoutURL': '/?logout=true',
            'loginURL': '/'
        }
    })
