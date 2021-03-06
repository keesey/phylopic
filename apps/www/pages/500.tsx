import { BuildContainer } from "@phylopic/utils-api"
import { NextPage } from "next"
import Head from "next/head"
import SearchContainer from "~/search/SearchContainer"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const Page: NextPage = () => (
    <BuildContainer>
        <PageLoader />
        <Head>
            <title>PhyloPic: Server Error</title>
        </Head>
        <SearchContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <SearchOverlay>
                    <header>
                        <Breadcrumbs
                            items={[{ children: "Home", href: "/" }, { children: <strong>Server Error</strong> }]}
                        />
                        <h1>Server Error</h1>
                    </header>
                    <p>Sorry for the inconvenience. Please check back later.</p>
                    <p>
                        You may also <a href="https://github.com/keesey/phylopic/issues/new">report the issue</a>.
                    </p>
                </SearchOverlay>
            </main>
            <SiteFooter />
        </SearchContainer>
    </BuildContainer>
)
export default Page
