import { ImageWithEmbedded } from "@phylopic/api-models"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SchemaMetadata from "~/metadata/SchemaMetadata"
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
const PageComponent: NextPage<Props> = ({ build, fallback }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="PhyloPic" url="https://www.phylopic.org/">
                <SchemaMetadata
                    object={{
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        potentialAction: {
                            "@type": "SearchAction",
                            query: "required name=search_term_string",
                            target: "https://www.phylopic.org/search?q={search_term_string}",
                        },
                        url: "https://www.phylopic.org",
                    }}
                />
                <SchemaMetadata
                    object={{
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 0,
                                url: "https://www.phylopic.org/images",
                            },
                            {
                                "@type": "ListItem",
                                position: 1,
                                url: "https://www.phylopic.org/nodes",
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                url: "https://www.phylopic.org/contributors",
                            },
                            {
                                "@type": "ListItem",
                                position: 3,
                                url: "https://www.phylopic.org/donate",
                            },
                            {
                                "@type": "ListItem",
                                position: 4,
                                url: "https://www.phylopic.org/thanks",
                            },
                            {
                                "@type": "ListItem",
                                position: 5,
                                url: "https://contribute.phylopic.org",
                            },
                            {
                                "@type": "ListItem",
                                position: 6,
                                url: "https://api-docs.phylopic.org",
                            },
                        ],
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
