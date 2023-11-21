import Head from 'next/head';
import Link from "next/link";

export default function Home() {
    return (
        <div className="container">
            <Head>
                <title>FastComments Next.JS</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                <h1>FastComments Next.js Examples</h1>
                <ul>
                    <li><Link href="/example-simple">Simple Example</Link></li>
                    <li><Link href="/example-secure-sso">Secure SSO Example</Link></li>
                    <li><Link href="/example-simple-sso">Simple SSO Example</Link></li>
                    <li><Link href="/example-user-notifications">List User Unread Notifications</Link></li>
                </ul>
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
