### Client-Side Rendering (Interactive App)

This is a demo of the FastComments SSO integration with PHP.
In this project you'll see two files - server.php and view.php.

server.php contains the logic for creating the SSO payload. We just call it server.php to drive the point home that this logic
should reside on the server and not on the client in JS - since we should **never** expose our secret key.

You can and should replace view.php with any templating mechanism you desire.

**To run** you should place the two files in an accessible directory and access server.php

This will work as-is since it uses a pre-created demo account, however in production you'd have to define your own secret key (in server.php) and tenant id (in view.php).

### Server-Side Rendering

FastComments can be used in a completely server-side rendered fashion, by calling the SSR API.

See an example, along with SSO, in the `ssr` folder.
