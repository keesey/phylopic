import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import BuildContainer from "~/builds/BuildContainer"
import MailingListForm from "~/forms/MailingListForm"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <SWRConfig>
        <BuildContainer>
            <PageLoader />
            <PageHead title="Sign up for the PhyloPic Mailing List" url="https://www.phylopic.org/mailinglist" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header>
                            <Breadcrumbs
                                items={[{ children: "Home", href: "/" }, { children: <strong>Mailing List</strong> }]}
                            />
                            <h1>
                                <SiteTitle /> Mailing List
                            </h1>
                        </header>
                        <section>
                            <p>
                                Subscribe to the <SiteTitle /> newsletter to receives updates about the
                                site&mdash;improvements, new features, and more!
                            </p>
                            <MailingListForm />
                        </section>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
