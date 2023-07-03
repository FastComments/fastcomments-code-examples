import Head from 'next/head';
import {FastCommentsCommentWidget} from "fastcomments-react";
import {useRouter} from "next/router";

// Note: Simple SSO is less secure than the Secure SSO solution, which uses HMAC to sign the payload.
// The trade-off is it is much simpler to implement.

const TENANT_ID = 'demo'; // REPLACE THIS WITH YOUR TENANT ID

function getSSOConfig(isLoggedIn) {
    // Create the user object from your database.
    const someUser = {
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

    if (isLoggedIn) {
        return {
            ...someUser,
            logoutURL: '/?logout=true',
            loginURL: '/'
        };
    } else {
        return {
            loginURL: '/'
        };
    }
}

export default function ExampleSimpleSecureSSO() {
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
                <h1>FastComments Simple SSO Next.js Example</h1>
                <FastCommentsCommentWidget tenantId={TENANT_ID} urlId={asPath} url={fullURL}
                                           simpleSSO={getSSOConfig(IS_LOGGED_IN)}></FastCommentsCommentWidget>
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
