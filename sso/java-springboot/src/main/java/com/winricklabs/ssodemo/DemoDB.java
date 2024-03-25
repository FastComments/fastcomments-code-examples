package com.winricklabs.ssodemo;

import com.winricklabs.ssodemo.domain.FastCommentsSSOUser;

import java.util.HashMap;
import java.util.Map;

public class DemoDB {
    private final Map<String, FastCommentsSSOUser> users = new HashMap<>(3);

    public DemoDB() {
        final FastCommentsSSOUser userOne = new FastCommentsSSOUser();
        userOne.id = "user-1"; // Do NOT put private information in the id.
        userOne.email = "user-1@somewhere.com";
        userOne.username = "user-1";
        userOne.displayName = "User One";
        userOne.avatar = "https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg";
        userOne.optedInNotifications = true;
        userOne.displayLabel = "VIP User";
        userOne.websiteUrl = "https://example.com/user-profile-page";
        userOne.isAdmin = true;
        userOne.isModerator = false;

        final FastCommentsSSOUser userTwo = new FastCommentsSSOUser();
        userTwo.id = "user-2"; // Do NOT put private information in the id.
        userTwo.email = "user-2@somewhere.com";
        userTwo.username = "user-2";
        userTwo.displayName = "User Two";
        userTwo.avatar = null;
        userTwo.websiteUrl = null;
        userTwo.optedInNotifications = true;
        userTwo.isAdmin = false;
        userTwo.isModerator = false;

        final FastCommentsSSOUser userThree = new FastCommentsSSOUser();
        userThree.id = "user-3"; // Do NOT put private information in the id.
        userThree.email = "user-3@somewhere.com";
        userThree.username = "user-3";
        userThree.displayName = "User Three";
        userThree.avatar = null;
        userThree.websiteUrl = null;
        userThree.optedInNotifications = false;
        userThree.isAdmin = false;
        userThree.isModerator = false;

        users.put(userOne.id, userOne);
        users.put(userTwo.id, userTwo);
        users.put(userThree.id, userThree);
    }

    public FastCommentsSSOUser getUser(String userId) {
        return users.get(userId);
    }
}
