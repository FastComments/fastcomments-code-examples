### Custom Client Example

This is an example of using FastComments with the [Public API](https://docs.fastcomments.com/guide-api.html).

Usually, you don't want to build your own client. We provide a lot of configuration and flexibility on how to customize the FastComments.com comment widget.

But if you really want to - this is how. :)

### Overview

Key Takeaways:

1. We have a server setup to hide our API key from the client.
2. To load the comments, we fetch the comments for a given page, as well as the votes for the current user, so we can show what comments the user has voted on.
3. We assume our user is logged in and verified, so all comments are marked with `verified = true` and `approved = true`.
4. The example client is not "live", as this is very complicated to demonstrate. If you need to build a custom live client, please reach out to support.
5. The client is in VanillaJS, without frameworks, to be a simple way to illustrate how to use the API.

### Setup and Run

1. Ensure you have a "recent" (> 10) version of NodeJS.
2. Clone this repo, run `npm install` in this directory.
3. Run `npm start`
4. Go to http://localhost:3339
