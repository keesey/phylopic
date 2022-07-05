import { BuildContainer } from "@phylopic/utils-api"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import AnchorLink from "~/ui/AnchorLink"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BulletList from "~/ui/BulletList"
import InlineSections from "~/ui/InlineSections"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
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
                                    { children: "Donate", href: "/donate" },
                                    { children: <strong>Thanks for Your Donation</strong> },
                                ]}
                            />
                            <h1>Thank you so much!</h1>
                        </header>
                        <section>
                            <p>
                                Your generous donation will help keep <SiteTitle /> online. Thousands of educators,
                                researchers, and students will be able to search the taxonomic database for freely
                                reusable silhouettes <strong>thanks to you!</strong>
                            </p>
                        </section>
                        <section>
                            <h2>Other Ways to Help Out</h2>
                            <InlineSections>
                                <section>
                                    <h3>Support Free Technologies</h3>
                                    <p>
                                        <SiteTitle /> relies on a number of free, open-source technologies. Support them
                                        as well! Here are a few:
                                    </p>
                                    <BulletList>
                                        <li>
                                            <a href="https://inkscape.org/support-us/">Inkscape</a>
                                        </li>
                                        <li>
                                            <a href="https://imagemagick.org/script/support.php#support">ImageMagick</a>
                                        </li>
                                        <li>
                                            <a href="https://opencollective.com/mochajs#support">Mocha</a>
                                        </li>
                                    </BulletList>
                                </section>
                                <section>
                                    <h3>Upload a Silhouette</h3>
                                    <p>
                                        <SiteTitle /> relies on silhouettes uploaded by people like you! Use the{" "}
                                        <a href="https://contribute.phylopic.org">Image Uploader</a> to add your artwork
                                        the database of freely reusable images!
                                    </p>
                                    <p></p>
                                </section>
                                <section>
                                    <h3>Become a Patron</h3>
                                    <p>
                                        For as little as $1 a month, you can see previews of new <SiteTitle />{" "}
                                        functionality, as well as updates on other projects by{" "}
                                        <AnchorLink
                                            href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`}
                                        >
                                            Mike Keesey
                                        </AnchorLink>
                                        , like the comic book series{" "}
                                        <a href="https://www.keesey-comics.com/paleocene">
                                            <cite>Paleocene</cite>
                                        </a>
                                        .{" "}
                                        <a href="https://www.patreon.com/tmkeesey?fan_landing=true">Become a patron!</a>
                                    </p>
                                </section>
                                <section>
                                    <h3>Software Engineering</h3>
                                    <p>
                                        If you are technically inclined, check out the{" "}
                                        <a href="https://github.com/keesey/phylopic">code repository</a> and/or the{" "}
                                        <a href="http://api-docs.phylopic.org/2.0">API Documentation</a>. Think about
                                        contributing to <SiteTitle /> or building a tool that uses it.
                                    </p>
                                </section>
                                <section>
                                    <h3>Spread the Word!</h3>
                                    <p>
                                        Tell people about{" "}
                                        <a href="https://www.phylopic.org">
                                            <SiteTitle />
                                        </a>
                                        !
                                    </p>
                                </section>
                            </InlineSections>
                        </section>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
