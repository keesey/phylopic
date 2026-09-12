import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import FundraiserSection from "~/sections/FundraiserSection"
import Breadcrumbs from "~/ui/Breadcrumbs"

const Home: NextPage = () => (
    <>
        <Head>
            <title>PhyloPic Editor</title>
        </Head>
        <main>
            <header>
                <Breadcrumbs items={[{ children: "Home" }]} />
                <h1>
                    <cite>PhyloPic</cite> Editor
                </h1>
            </header>
            <hr />
            <nav>
                <ul>
                    <li>
                        <Link href="contributors">Contributors</Link>
                    </li>
                    <li>
                        <Link href="images">Images</Link>
                    </li>
                    <li>
                        <Link href="nodes">Nodes</Link>
                    </li>
                    <li>
                        <Link href="submissions">Submissions</Link>
                    </li>
                    <li>
                        <Link href="externals">External Authorities</Link>
                    </li>
                </ul>
            </nav>
            <hr />
            <FundraiserSection />
        </main>
    </>
)
export default Home
