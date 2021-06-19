<?php
    /*
     * DO NOT RUN THIS FILE DIRECTLY. Run server.php.
     */
    global $sso_payload;
?>
<html>
<head>
    <meta name='viewport' content='width=device-width'>
</head>
<body>

<h1>FastComments SSO Demo!</h1>

<script src="https://cdn.fastcomments.com/js/embed-v2.min.js"></script>
<div id="fastcomments-widget"></div>
<script>
    window.FastCommentsUI(document.getElementById('fastcomments-widget'), {
        tenantId: 'demo', // REPLACE THIS WITH YOUR TENANT ID
        sso: <?php echo json_encode($sso_payload) ?>
    });
</script>
</body>
