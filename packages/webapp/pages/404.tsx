import Head from "next/head"
import React, { FC } from "react"
import BuildContainer from "~/builds/BuildContainer"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import AnchorLink from "~/ui/AnchorLink"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const Page: FC = () => (
    <BuildContainer>
        <PageLoader />
        <Head>
            <title>PhyloPic: Incertae Sedis</title>
        </Head>
        <SearchContainer>
            <header>
                <SiteNav />
            </header>
            <main>
                <SearchOverlay>
                    <header>
                        <Breadcrumbs
                            items={[
                                { children: "Home", href: "/" },
                                {
                                    children: (
                                        <strong>
                                            <em>Incertae Sedis</em>
                                        </strong>
                                    ),
                                },
                            ]}
                        />
                        <h1>
                            <em>Incertae Sedis</em>
                        </h1>
                        <p>
                            The page you requested cannot be found. Please try the{" "}
                            <AnchorLink href="/">Home Page</AnchorLink>.
                        </p>
                    </header>
                </SearchOverlay>
            </main>
            <SiteFooter />
        </SearchContainer>
    </BuildContainer>
)
export default Page
