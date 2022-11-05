This is a demo of FastComments SSO in a very simple Python 3 app. It is written w/ Python 3.8.

It only uses the standard library.

See `fastcomments_sso.py` for how to create the SSO payload **server-side**.
See `server.py` for how to pass the SSO payload to FastComments **client-side**.

In `server.py` we just send back HTML with the widget JSON payload pre-populated, as an example of simple server-side-rendering.

You could instead render the page and call an API that calls `get_fast_comments_config_with_secure_sso_payload`.

This will work as-is since it uses a pre-created demo account, however in production you'd have to define your own secret key and tenant id.
You may set your own api key and tenant id in `fastcomments_sso.py`.

To run, run `python server.py` and open [http://localhost:8000](http://localhost:8000).
