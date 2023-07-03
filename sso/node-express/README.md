This is a demo of FastComments SSO in a very simple ExpressJS app.

See routes/index.js for how to create the SSO payload **server-side**.
See views/index.ejs for how to pass the SSO payload to FastComments **client-side**.

This will work as-is since it uses a pre-created demo account, however in production you'd have to define your own secret key and tenant id.
You may set your own api key and tenant id in `routes/index.js`.

To run, run "npm install && npm run start" and open http://localhost:3003
