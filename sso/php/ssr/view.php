<?php
    /*
     * DO NOT RUN THIS FILE DIRECTLY. Run server.php.
     */
    global $fastcomments_url;
?>
<html>
<head>
    <meta name='viewport' content='width=device-width'>
</head>
<body>

<h1>FastComments Server-Rendered SSO Demo!</h1>

<p>
    This example will not use JavaScript at all. If you desire a more interactive experience, try the normal client-rendered widget.
</p>

<iframe
        src="<?php echo $fastcomments_url; ?>"
        horizontalscrolling="no"
        allowtransparency="true"
        frameborder="0"
        title="FastComments"
        width="100%"
        height="1500px"
        style= "width: 1px !important; min-width: 100% !important; border: none !important; overflow: hidden !important;"
></iframe>

</body>
