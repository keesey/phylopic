/* eslint-disable jsx-a11y/anchor-is-valid */
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import React from "react"
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
            <nav>
                <ul>
                    <li>
                        <Link href="submissions">
                            <a>Submissions</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="images">
                            <a>Images</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="nodes">
                            <a>Nodes</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="phylogeny">
                            <a>Phylogeny</a>
                        </Link>
                    </li>
                    <li>
                        <Link href="externals">
                            <a>External Namespaces</a>
                        </Link>
                    </li>
                </ul>
            </nav>
        </main>
    </>
)
export default Home
