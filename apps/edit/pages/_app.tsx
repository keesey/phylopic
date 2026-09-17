import type { AppProps } from "next/app"
import Head from "next/head"
import React from "react"
import "../styles/globals.scss"

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link href="/icon.svg" rel="icon" type="image/svg+xml" />
                <link href="/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
                <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
                <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
                <link href="/site.webmanifest" rel="manifest" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
