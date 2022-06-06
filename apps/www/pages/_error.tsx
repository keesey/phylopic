import { NextPage } from "next"
import Head from "next/head"
import React from "react"
import SearchOverlay from "~/ui/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import { SearchContainer } from "@phylopic/search"
import { BuildContainer } from "@phylopic/utils-api"
export interface Props {
    statusCode: number
}
const Page: NextPage<Props> = ({ statusCode }) => (
    <BuildContainer>
        <PageLoader />
        <Head>
            <title>PhyloPic: Error</title>
        </Head>
        <SearchContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <SearchOverlay>
                    <header>
                        <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Error</strong> }]} />
                        <h1>Error</h1>
                    </header>
                    <p>Sorry for the inconvenience. Please check back later.</p>
                    <table>
                        <tbody>
                            <tr>
                                <th>Status Code</th>
                                <td>{statusCode}</td>
                            </tr>
                        </tbody>
                    </table>
                </SearchOverlay>
            </main>
        </SearchContainer>
        <SiteFooter />
    </BuildContainer>
)
Page.getInitialProps = ({ err, res }) => {
    const statusCode = res?.statusCode ?? err?.statusCode ?? 404
    return { statusCode }
}
export default Page
