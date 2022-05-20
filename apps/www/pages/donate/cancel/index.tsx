import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import InlineSections from "~/ui/InlineSections"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <SWRConfig>
        <BuildContainer>
            <PageLoader />
            <PageHead title="PhyloPic: Other Ways to Contribute" url="https://www.phylopic.org/contribute/cancel" />
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
                                    { children: "Donate", href: "/donate" },
                                    { children: <strong>Other Ways to Contribute</strong> },
                                ]}
                            />
                            <p>
                                Decided not to donate to <SiteTitle />?
                            </p>
                            <h1>Other Ways to Contribute</h1>
                        </header>
                        <InlineSections>
                            <section>
                                <h2>Upload a Silhouette</h2>
                                <p>
                                    <SiteTitle /> relies on silhouettes uploaded by people like you! Use the{" "}
                                    <a href="https://contribute.phylopic.org">Image Uploader</a> to add your artwork the
                                    database of freely-reusable images!
                                </p>
                                <p></p>
                            </section>
                            <section>
                                <h2>Become a Patron</h2>
                                <p>:TODO:</p>
                            </section>
                            <section>
                                <h2>Spread the Word!</h2>
                                <p>:TODO:</p>
                            </section>
                            <section>
                                <h2>Support Technologies</h2>
                                <p>:TODO:</p>
                            </section>
                            <section>
                                <h2>Software Engineering</h2>
                                <p>:TODO:</p>
                            </section>
                            <section>
                                <h2>Change Your Mind?</h2>
                                <p>:TODO:</p>
                            </section>
                        </InlineSections>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
