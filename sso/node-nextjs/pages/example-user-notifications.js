import Head from 'next/head';
import axios from 'axios';

export async function getServerSideProps() {
    const API_SECRET = 'DEMO_API_SECRET'; // Replace this with your own in production! This will only work with the "demo" tenant id.
    const TENANT_ID = 'demo'; // REPLACE THIS WITH YOUR TENANT ID
    const loggedInUserId = "some-user-id"; // change to null to demo logged out behavior
    const userUnreadNotificationsResponse = await axios.get(`https://fastcomments.com/api/v1/notifications?tenantId=${TENANT_ID}&API_KEY=${API_SECRET}&userId=${loggedInUserId}&viewed=false`);
    // console.log('notifications response', userUnreadNotificationsResponse);

    // See here for how to understand the notification structure: https://docs.fastcomments.com/guide-api.html#notification-structure
    return {
        props: {
            userNotifications: userUnreadNotificationsResponse.data.notifications,
        },
    };
}

export default function ExampleUserNotifications({ userNotifications }) {
    return (
        <div className="container">
            <Head>
                <title>FastComments Next.JS</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1>FastComments Unread Notifications Next.js Example</h1>
                {JSON.stringify(userNotifications)}
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


