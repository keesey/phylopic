import { BuildContainer } from "@phylopic/utils-api"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import MailingListForm from "~/forms/MailingListForm"
import PageHead from "~/metadata/PageHead"
import SchemaScript from "~/metadata/SchemaScript"
import SearchContainer from "~/search/SearchContainer"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <SWRConfig>
        <BuildContainer>
            <PageLoader />
            <PageHead description="Get updates on new features for PhyloPic, the open database of freely-reuseable silhouette images of organisms." title="Sign up for the PhyloPic Mailing List" url="https://www.phylopic.org/mailinglist">
                <SchemaScript
                    object={{
                        "@context": "https://schema.org",
                        "@type": "MediaSubscription",
                        "@id": "http://www.phylopic.org/mailinglist",
                        description: "Newsletter for PhyloPic.",
                        name: "PhyloPic Mailing List",
                        url: "http://www.phylopic.org/mailinglist",
                    }}
                />
            </PageHead>
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
