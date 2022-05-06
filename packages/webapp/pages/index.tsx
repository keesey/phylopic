import axios from "axios"
import type { GetStaticProps, NextPage } from "next"
import { ImageWithEmbedded, List } from "@phylopic/api-models"
import React from "react"
import { SWRConfig } from "swr"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import AnchorLink from "~/ui/AnchorLink"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ContributionCTAView from "~/views/ContributionCTAView"
import ImageListView from "~/views/ImageListView"
import SupportersView from "~/views/SupportersView"
export interface Props {
    error?: string
    latest: readonly ImageWithEmbedded[]
    total: number
}
const IMAGES_TO_LOAD = 12
const Page: NextPage<Props> = ({ error, latest, total }) => (
    <SWRConfig>
        <BuildContainer>
            <PageLoader />
            <PageHead title="PhyloPic" url="https://www.phylopic.org/" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header>
                            <p>
                                <strong>Free silhouette images</strong> of animals, plants, and other life forms,{" "}
                                <strong>available for reuse</strong> under{" "}
                                <a href="//creativecommons.org">Creative Commons</a> licenses.
                            </p>
                        </header>
                        {error && (
                            <section>
                                <h2>Error!</h2>
                                <p>Please try again later.</p>
                                <div>
                                    <code>{error}</code>
                                </div>
                            </section>
                        )}
                        {!error && (
                            <section>
                                <h2>Latest Silhouette Images</h2>
                                <ImageListView value={latest} />
                                <p>
                                    <strong>{total}</strong> silhouette image{total === 1 ? "" : "s"} in the database.{" "}
                                    <AnchorLink href="/images">See more →</AnchorLink>
                                </p>
                            </section>
                        )}
                        <ContributionCTAView />
                        <section>
                            <h2>Special Thanks</h2>
                            <SupportersView />
                        </section>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props, {}> = async () => {
    try {
        const result = await axios.get<List<ImageWithEmbedded>>(
            `${process.env.NEXT_PUBLIC_API_URL}/images?length=${IMAGES_TO_LOAD}&embed=specificNode`,
        )
        return {
            props: {
                latest: result.data._embedded.items,
                total: result.data.total,
            },
            revalidate: 24 * 60 * 60,
        }
    } catch (e) {
        console.error(e)
        return {
            props: { error: String(e), latest: [], total: 0 },
        }
    }
}
