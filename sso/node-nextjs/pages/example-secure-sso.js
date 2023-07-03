import Head from 'next/head';
import {FastCommentsCommentWidget} from "fastcomments-react";
import {useRouter} from "next/router";
import * as crypto from 'crypto';

const API_SECRET = 'DEMO_API_SECRET'; // Replace this with your own in production! This will only work with the "demo" tenant id.
const TENANT_ID = 'demo'; // REPLACE THIS WITH YOUR TENANT ID

function getSSOConfig(isLoggedIn) {
    // Create the user object from your database.
    const someUser = {
        id: 1,
        email: 'someone@somewhere.com',
        username: 'someone',
        displayName: 'Some Username',
        avatar: 'https://static.fastcomments.com/1582299581264-69384190_3015192525174365_476457575596949504_o.jpg',
        optedInNotifications: true,
        displayLabel: 'VIP User',
        websiteUrl: null, // You can set this to a link to the user's account page, or maybe their own website.
        isAdmin: false,
        isModerator: false
    };

    const userDataJSON = JSON.stringify(someUser);
    const userDataJSONBase64 = Buffer.from(userDataJSON).toString('base64');

    const now = Date.now();
    const verificationHash = crypto
        .createHmac('sha256', API_SECRET)
        .update(now + userDataJSONBase64)
        .digest('hex');

    return {
        userDataJSONBase64: isLoggedIn ? userDataJSONBase64 : null, // implement your own login/out mechanism.
        verificationHash: isLoggedIn ? verificationHash : null,
        timestamp: now,
        logoutURL: '/?logout=true',
        loginURL: '/'
    };
}

export default function ExampleSecureSSO() {
    const IS_LOGGED_IN = true; // change to demo logged out behavior
    const {asPath} = useRouter(); // comments will be tied to this (page specific but domain-agnostic)
    const origin =
        typeof window !== "undefined" && window.location.origin
            ? window.location.origin
            : "";

    const fullURL = origin + asPath; // but link directly to this (absolute url)
    return (
        <div className="container">
            <Head>
                <title>FastComments Next.JS</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1>FastComments Secure SSO Next.js Example</h1>
                <FastCommentsCommentWidget tenantId={TENANT_ID} urlId={asPath} url={fullURL} sso={getSSOConfig(IS_LOGGED_IN)}></FastCommentsCommentWidget>
            </main>

            <style jsx>{`
              .container {
                padding: 20px;
              }

              main {
                padding: 5rem 0;
              }
            `}</style>

            <style jsx global>{`
              html,
              body {
                padding: 0;
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
                Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                sans-serif;
              }

              * {
                box-sizing: border-box;
              }
            `}</style>
        </div>
    );
}
