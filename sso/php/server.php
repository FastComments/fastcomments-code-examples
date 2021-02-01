<?php

// This doesn't really have to be a class, but it is to demonstrate the separation of concerns of creating the config vs rendering your page.
class Server
{
    private $API_SECRET = 'DEMO_API_SECRET';

    private function get_sso_config($ssoKey)
    {
        $timestamp = time() * 1000;

        $result = array();
        $result['timestamp'] = $timestamp;

        // Here we hard code the user, but you should fetch the user information from your database.
        $sso_user = array();
        $sso_user['id'] = 'some-user-id';
        $sso_user['email'] = 'some-user@someplace.com';
        $sso_user['username'] = 'some-sso-user';
        $sso_user['avatar'] = 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg';
        $sso_user['optedInNotifications'] = true;
        $sso_user['displayLabel'] = 'VIP User';

        $userDataJSONBase64 = base64_encode(json_encode($sso_user));
        $verificationHash = hash_hmac('sha256', $timestamp . $userDataJSONBase64, $ssoKey);

        // The ?logout=true checks here are just for the demo, you can remove them.
        $isLoggedOut = isset($_GET['logout']);
        $result['userDataJSONBase64'] = $isLoggedOut ? null : $userDataJSONBase64;
        $result['verificationHash'] = $isLoggedOut ? null : $verificationHash;
        $result['loginURL'] = '?login'; // Replace with an actual login page url.
        $result['logoutURL'] = '?logout=true'; // Replace with an actual logout page url.

        return $result;
    }

    public function render()
    {
        global $sso_payload;
        $sso_payload = $this->get_sso_config($this->API_SECRET);
        // Normally you'd pass $sso_payload to your view engine.
        include "view.php";
    }
}

$server = new Server();
$server->render();
