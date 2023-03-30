import { ImageWithEmbedded } from "@phylopic/api-models"
import { CountView, PaginationContainer } from "@phylopic/ui"
import { URL } from "@phylopic/utils"
import { Compressed } from "compress-json"
import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import MailingListForm from "~/forms/MailingListForm"
import PocketPhylogenies from "~/materials/PocketPhylogenies"
import SchemaScript from "~/metadata/SchemaScript"
import ItemListSchemaScript from "~/metadata/SchemaScript/ItemListSchemaScript"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import HeaderNav from "~/ui/HeaderNav"
import SiteTitle from "~/ui/SiteTitle"
import ContributionCTAView from "~/views/ContributionCTAView"
import ImageListView from "~/views/ImageListView"
import SupportersView from "~/views/SupportersView"
type Props = Omit<PageLayoutProps, "children"> & { fallback?: Compressed }
const ITEM_URLS: readonly URL[] = [
    `${process.env.NEXT_PUBLIC_WWW_URL}/images`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/nodes`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/contributors`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/thanks`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`,
    `${process.env.NEXT_PUBLIC_WWW_URL}/api-recipes`,
    "http://api-docs.phylopic.org/v2",
    `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}`,
    "https://keesey.gumroad.com/l/pocketphylogenies",
]
const PageComponent: NextPage<Props> = ({ fallback, ...props }) => (
    <CompressedSWRConfig fallback={fallback}>
        <PageLayout {...props}>
            <NextSeo
                additionalMetaTags={[
                    {
                        name: "keywords",
                        content:
                            "animals,archaea,bacteria,biology,clip art,clipart,diagrams,free art,free clip art,free clipart,fungi,microorganisms,organisms,phylogeny,plants,protists,silhouette,silhouettes,species,taxonomy,visualization,viz",
                    },
                ]}
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}`}
                description="PhyloPic is an open database of free silhouette images of animals, plants, and other life forms, available for reuse under Creative Commons licenses. Download silhouettes for use in educational materials, research articles, and other projects."
            />
            <SchemaScript
                id="WebSite"
                object={{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    potentialAction: {
                        "@type": "SearchAction",
                        query: "required",
                        target: {
                            "@type": "EntryPoint",
                            urlTemplate: `${process.env.NEXT_PUBLIC_WWW_URL}/search?q={query}`,
                        },
                    },
                    url: `${process.env.NEXT_PUBLIC_WWW_URL}`,
                }}
            />
            <SchemaScript
                id="Person"
                object={{
                    "@context": "https://schema.org",
                    "@id": "http://tmkeesey.net",
                    "@type": "Person",
                    alternateName: "T. Michael Keesey",
                    email: "keesey@gmail.com",
                    name: "Mike Keesey",
                    sameAs: process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID
                        ? `${process.env.NEXT_PUBLIC_WWW_URL}/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`
                        : undefined,
                    url: "http://tmkeesey.net",
                }}
            />
            <ItemListSchemaScript urls={ITEM_URLS} />
            <header>
                <p>
                    <strong>Free silhouette images</strong> of animals, plants, and other life forms,{" "}
                    <strong>available for reuse</strong> under{" "}
                    <a href="//creativecommons.org" rel="external">
                        Creative Commons
                    </a>{" "}
                    licenses.
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
                    header="Latest Uploads"
                    headerLevel={2}
                />
                <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/images"} maxPages={1}>
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
            <section style={{ minWidth: "100vw" }}>
                <header style={{ maxWidth: "11in", margin: "0 auto" }}>
                    <HeaderNav
                        buttons={[
                            {
                                children: "Download →",
                                href: "/materials",
                                key: "materials",
                                type: "anchor",
                            },
                        ]}
                        header="Pocket Phylogenies"
                        headerLevel={2}
                    />
                    <p>
                        Free wallet-sized cards with common questions about evolution on one side, and diagrams for
                        explaining the answers on the other. Click on the cards below to see the diagrams, and{" "}
                        <a href="//keesey.gumroad.com/l/pocketphylogenies">
                            click here to print out Pocket Phylogenies for yourself
                        </a>
                        .
                    </p>
                </header>
                <PocketPhylogenies />
            </section>
            <section>
                <h2>Mailing List</h2>
                <p>
                    Subscribe to the <SiteTitle /> newsletter to receives updates about the site&mdash;improvements, new
                    features, and more!
                </p>
                <MailingListForm />
            </section>
            <section>
                <HeaderNav
                    buttons={[
                        {
                            children: "See more →",
                            href: "/thanks",
                            key: "thanks",
                            type: "anchor",
                        },
                    ]}
                    header="Special Thanks"
                    headerLevel={2}
                />
                <SupportersView />
            </section>
        </PageLayout>
    </CompressedSWRConfig>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images")
