import { ImageWithEmbedded } from "@phylopic/api-models"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import ImagePageContainer from "~/swr/data/IMagePageContainer"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import AnchorLink from "~/ui/AnchorLink"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ContributionCTAView from "~/views/ContributionCTAView"
import ImageListView from "~/views/ImageListView"
import NumberView from "~/views/NumberView"
import SupportersView from "~/views/SupportersView"
export interface Props {
    build: number
    fallback: PublicConfiguration["fallback"]
}
const PageComponent: NextPage<Props> = ({ build, fallback }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
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
                        <section>
                            <h2>Latest Contributions</h2>
                            <PaginationContainer
                                endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"}
                                query={{ embed_specificNode: true }}
                                maxPages={1}
                            >
                                {(images, totalImages) => (
                                    <>
                                        <ImageListView value={images as readonly ImageWithEmbedded[]} />
                                        <p>
                                            <NumberView value={totalImages} /> silhouette images in the database.{" "}
                                            <AnchorLink href="/images">See more →</AnchorLink>
                                        </p>
                                    </>
                                )}
                            </PaginationContainer>
                        </section>
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
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images", {
    embed_specificNode: true,
})
