import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
const Page: NextPage = () => (
    <>
        <Head>
            <title>PhyloPic: Incertae Sedis</title>
        </Head>
        <main>
            <section>
                <p>I think we got a little lost.</p>
                <Link href="/" className="cta">
                    <a>Start over</a>
                </Link>
            </section>
        </main>
    </>
)
export default Page
