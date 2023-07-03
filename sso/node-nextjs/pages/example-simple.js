import Head from 'next/head';
import {FastCommentsCommentWidget} from "fastcomments-react";
import {useRouter} from "next/router";

const TENANT_ID = 'demo'; // REPLACE THIS WITH YOUR TENANT ID

export default function ExampleSimple() {
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
                <h1>FastComments Simple Next.js Example</h1>
                <FastCommentsCommentWidget tenantId={TENANT_ID} urlId={asPath} url={fullURL}></FastCommentsCommentWidget>
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
