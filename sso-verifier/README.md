# SSO Verifier

This tool can cause an API with a specified concurrency limit to check for concurrency bugs (returning wrong user, HMAC hashed wrong, etc).

It outputs like this:

    Running for 3 users.
     12:36:46PM Success=[1,900] Errors=[0]
     12:36:47PM Success=[4,750] Errors=[0]
     12:36:48PM Success=[7,848] Errors=[0]

In [config.json](config.json) you can configure a number of things:

```json
    {
          "HTTP_URI": "http://localhost:8080/demo-api",
          "HTTP_METHOD": "GET",
          "CONCURRENT_COUNT": 100,
          "DELAY_MS": 10,
          "DURATION_MS": 60000,
          "VERIFY_USER_DETAILS": false,
          "users": [...
```

You can customize calling your API in the `callEndpoint()` function.

### Usage:

Install NodeJS and NPM, then `npm install` in this directory to pull in dependencies. Then, you can run it:
    
    API_KEY="YOUR_API_KEY" npm run verifier
