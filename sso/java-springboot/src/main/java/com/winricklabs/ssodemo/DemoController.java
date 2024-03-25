package com.winricklabs.ssodemo;

import com.google.gson.Gson;
import com.winricklabs.ssodemo.domain.FastCommentsSSOPayload;
import com.winricklabs.ssodemo.domain.FastCommentsSSOUser;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigInteger;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Objects;

@Controller
public class DemoController {

    private static final String FC_API_KEY = "DEMO_API_SECRET";
    private final Gson gson = new Gson();
    private final Mac encrypt;
    private final DemoDB db;

    public DemoController() throws NoSuchAlgorithmException, InvalidKeyException {
        // Setup HMAC-SHA256 encryption so we don't do it per-request. Note the use of .clone() later to make this thread-safe.
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(FC_API_KEY.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        this.encrypt = sha256_HMAC;
        this.db = new DemoDB();
    }

    @GetMapping("/demo")
    public String demo(@RequestParam(name = "logout", required = false, defaultValue = "false") String logout, Model model) throws CloneNotSupportedException {
        final boolean isLoggedOut = Objects.equals(logout, "true"); // Just to demo an unauthenticated user.
        model.addAttribute("logout", logout);
        model.addAttribute("ssoPayloadString", gson.toJson(isLoggedOut ? this.getLoggedOutSSOPayload() : this.getSSOPayload("user-1")));

        return "demo"; // we return the view to render
    }

    // RestController for API endpoint, nested to share configuration and services
    @RestController
    @RequestMapping("/demo-api") // Base path for the API methods in this nested controller
    public class DemoApiController {

        @GetMapping
        public FastCommentsSSOPayload demoApi(@RequestParam(name = "userId", required = false) String userId) throws CloneNotSupportedException {
            return getSSOPayload(userId);
        }
    }

    private FastCommentsSSOPayload getSSOPayload(String userId) throws CloneNotSupportedException {
        // Get our user from our "database".
        final FastCommentsSSOUser user = this.db.getUser(userId);

        final long now = System.currentTimeMillis();

        // Setup our payload object, and return it.
        FastCommentsSSOPayload fastCommentsSSOPayload = new FastCommentsSSOPayload();
        fastCommentsSSOPayload.timestamp = now;

        // Setup and serialize our user information as JSON, and then Base64 encode it.
        fastCommentsSSOPayload.userDataJSONBase64 = Base64.encodeBase64String(gson.toJson(user).getBytes());

        // Create a verification hash of the encoded data.
        final Mac clonedMac = (Mac) this.encrypt.clone(); // Very important for thread safety!

        // After we do the actual encryption we have to convert it to a hex string.
        fastCommentsSSOPayload.verificationHash = this.getBytesAsHex(clonedMac.doFinal((now + fastCommentsSSOPayload.userDataJSONBase64).getBytes()));
        fastCommentsSSOPayload.loginURL = "/demo";
        fastCommentsSSOPayload.logoutURL = "/demo?logout=true";

        return fastCommentsSSOPayload;
    }

    private String getBytesAsHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder(String.format("%032x", new BigInteger(1, bytes)));
        // Ensure the string is exactly 64 characters long, padding with leading zeros if necessary
        while (hexString.length() < 64) {
            hexString.insert(0, "0");
        }
        return hexString.toString();
    }

    // When logged out, we should return an almost empty FastCommentsSSOPayload - but it should have the login/out urls!
    private FastCommentsSSOPayload getLoggedOutSSOPayload() {
        FastCommentsSSOPayload fastCommentsSSOPayload = new FastCommentsSSOPayload();
        fastCommentsSSOPayload.loginURL = "/demo";
        fastCommentsSSOPayload.logoutURL = "/demo?logout=true";

        return fastCommentsSSOPayload;
    }
}
