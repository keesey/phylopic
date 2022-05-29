import { ImageWithEmbedded } from "@phylopic/api-models"
import { URL } from "@phylopic/utils"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SchemaScript from "~/metadata/SchemaScript"
import ItemListSchemaScript from "~/metadata/SchemaScript/ItemListSchemaScript"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import HeaderNav from "~/ui/HeaderNav"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ContributionCTAView from "~/views/ContributionCTAView"
import CountView from "~/views/CountView"
import ImageListView from "~/views/ImageListView"
import SupportersView from "~/views/SupportersView"
export interface Props {
    build: number
    fallback: PublicConfiguration["fallback"]
}
const ITEM_URLS: readonly URL[] = [
    "https://www.phylopic.org/store",
    "https://www.phylopic.org/images",
    "https://www.phylopic.org/nodes",
    "https://www.phylopic.org/contributors",
    "https://www.phylopic.org/thanks",
    "https://api-docs.phylopic.org",
]
const PageComponent: NextPage<Props> = ({ build, fallback }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="PhyloPic" url="https://www.phylopic.org/">
                <SchemaScript
                    object={{
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        potentialAction: {
                            "@type": "SearchAction",
                            query: "required",
                            target: {
                                "@type": "EntryPoint",
                                urlTemplate: "https://www.phylopic.org/search?q={query}",
                            },
                        },
                        url: "https://www.phylopic.org",
                    }}
                />
                <ItemListSchemaScript urls={ITEM_URLS} />
            </PageHead>
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
                            <HeaderNav
                                buttons={[
                                    {
                                        children: "See more →",
                                        href: "/images",
                                        key: "images",
                                        type: "anchor",
                                    },
                                ]}
                                header="Latest Contributions"
                                headerLevel={2}
                            />
                            <PaginationContainer
                                endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"}
                                query={{ embed_specificNode: true }}
                                maxPages={1}
                            >
                                {(images, totalImages) => (
                                    <>
                                        <ImageListView value={images as readonly ImageWithEmbedded[]} />
                                        <p>
                                            <CountView value={totalImages} /> silhouette images in the database.
                                        </p>
                                    </>
                                )}
                            </PaginationContainer>
                        </section>
                        <ContributionCTAView />
                        <section>
                            <HeaderNav
                                buttons={[
                                    {
                                        children: "See more →",
                                        href: "/thanks",
                                        key: "images",
                                        type: "anchor",
                                    },
                                ]}
                                header="Special Thanks"
                                headerLevel={2}
                            />
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
