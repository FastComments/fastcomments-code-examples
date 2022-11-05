import base64
import hashlib
import hmac
import json as simplejson
import time

FASTCOMMENTS_API_SECRET = 'DEMO_API_SECRET' # Replace this with your own in production! This will only work with the "demo" tenant id.
FASTCOMMENTS_TENANT_ID = 'demo' # Replace this with your own in production!


# The return value of this function can be passed directly to the comment widget.
def get_fast_comments_config_with_secure_sso_payload(is_logged_in):
    user_data = {
        'id': 'some-user-id',
        'email': 'someone@someplace.com',
        'username': 'some-username',
        'displayName': 'Some Username',
        'avatar': 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        'optedInNotifications': True,
        'displayLabel': 'VIP User',
        'websiteUrl': None, # You can set this to a link to the user's account page, or maybe their own website.
        'isAdmin': False,
        'isModerator': False
    } if is_logged_in else None

    data = simplejson.dumps(user_data)
    # encode the data to base64
    user_data_json_base64 = bytes.decode(base64.b64encode(data.encode('utf-8')))
    # generate a timestamp for signing the message
    timestamp = int(time.time()*1000)
    # generate our hmac signature
    verification_hash = hmac.HMAC(FASTCOMMENTS_API_SECRET.encode('utf-8'), (str(timestamp) + user_data_json_base64).encode('utf-8'), hashlib.sha256).hexdigest()

    return simplejson.dumps({
        'tenantId': FASTCOMMENTS_TENANT_ID,
        'urlId': '/',
        'sso': {
            'userDataJSONBase64': user_data_json_base64 if is_logged_in else None, # implement your own login/out mechanism.
            'verificationHash': verification_hash if is_logged_in else None,
            'timestamp': timestamp,
            'logoutURL': '/?logout=true',
            'loginURL': '/'
        }
    })
