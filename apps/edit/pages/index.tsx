import { AnchorLink } from "@phylopic/ui"
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
                        <AnchorLink href="images">Images</AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href="nodes">Nodes</AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href="phylogeny">Phylogeny</AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href="submissions">Submissions</AnchorLink>
                    </li>
                    <li>
                        <AnchorLink href="externals">External Authorities</AnchorLink>
                    </li>
                </ul>
            </nav>
        </main>
    </>
)
export default Home
