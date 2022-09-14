import { ImageWithEmbedded } from "@phylopic/api-models"
import { CountView, PaginationContainer } from "@phylopic/ui"
import { URL } from "@phylopic/utils"
import type { NextPage } from "next"
import MailingListForm from "~/forms/MailingListForm"
import PocketPhylogenies from "~/materials/PocketPhylogenies"
import PageHead from "~/metadata/PageHead"
import SchemaScript from "~/metadata/SchemaScript"
import ItemListSchemaScript from "~/metadata/SchemaScript/ItemListSchemaScript"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import HeaderNav from "~/ui/HeaderNav"
import SiteTitle from "~/ui/SiteTitle"
import ContributionCTAView from "~/views/ContributionCTAView"
import ImageListView from "~/views/ImageListView"
import SupportersView from "~/views/SupportersView"
type Props = Omit<PageLayoutProps, "children">
const ITEM_URLS: readonly URL[] = [
    "https://www.phylopic.org/images",
    "https://www.phylopic.org/nodes",
    "https://www.phylopic.org/contributors",
    "https://www.phylopic.org/thanks",
    "https://www.phylopic.org/mailinglist",
    "http://api-docs.phylopic.org/2.0",
    "https://contribute.phylopic.org",
    "https://keesey.gumroad.com/l/pocketphylogenies",
]
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <PageHead
            title="PhyloPic"
            url="https://www.phylopic.org/"
            description="PhyloPic is an open database of free silhouette images of animals, plants, and other life forms, available for reuse under Creative Commons licenses."
        >
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
                            urlTemplate: "https://www.phylopic.org/search?q={query}",
                        },
                    },
                    url: "https://www.phylopic.org",
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
                        ? `https://www.phylopic.org/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`
                        : undefined,
                    url: "http://tmkeesey.net",
                }}
            />
            <ItemListSchemaScript urls={ITEM_URLS} />
        </PageHead>
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
            <PaginationContainer
                endpoint={"https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/images"}
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
                Free wallet-sized cards with common questions about evolution on one side, and diagrams for explaining
                the answers on the other. Click on the cards below to see the diagrams, and{" "}
                <a href="https://keesey.gumroad.com/l/pocketphylogenies">
                    click here to print out Pocket Phylogenies for yourself
                </a>
                .
            </p>
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
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<ImageWithEmbedded>("/images", {
    embed_specificNode: true,
})
