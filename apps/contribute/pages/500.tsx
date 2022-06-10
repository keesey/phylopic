/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
const Page: NextPage = () => (
    <>
        <Head>
            <title>PhyloPic: Server Error</title>
        </Head>
        <main>
            <section>
                <p>Something weird happened.</p>
                <Link href="/" className="cta">
                    <a>Start over</a>
                </Link>
            </section>
        </main>
    </>
)
export default Page