import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
const PageComponent: NextPage = () => (
    <SWRConfig>
        <BuildContainer>
            <PageLoader />
            <PageHead title="Thank You from PhyloPic!" url="https://www.phylopic.org/contribute/thanks" />
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
                                    { children: "Contribute", href: "/contribute" },
                                    { children: <strong>Thanks for Your Donation</strong> },
                                ]}
                            />
                            <h1>Thank you!</h1>
                        </header>
                        <section>:TODO:</section>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
