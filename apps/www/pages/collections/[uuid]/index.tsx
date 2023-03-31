import { Contributor, ImageParameters, List, Node } from "@phylopic/api-models"
import { Loader, PaginationContainer } from "@phylopic/ui"
import { createSearch, EMPTY_UUID, isUUIDish, Query, UUIDish } from "@phylopic/utils"
import { addBuildToURL } from "@phylopic/utils-api"
import axios from "axios"
import type { Compressed } from "compress-json"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { unstable_serialize } from "swr"
import customEvents from "~/analytics/customEvents"
import ImageCollectionUsage from "~/licenses/ImageCollectionUsage"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BulletList from "~/ui/BulletList"
import ImageListView from "~/views/ImageListView"
import NomenView from "~/views/NomenView"
const IMAGE_QUERY: Omit<ImageParameters, "uuid"> & Query = {
    embed_contributor: "true",
    embed_specificNode: "true",
}
type CollectionType = "contributors" | "images" | "nodes" | "multiple" | "empty"
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
    has: {
        contributors: boolean
        images: boolean
        nodes: boolean
    }
    uuid: UUIDish
}
const TYPE_LABELS: Readonly<Record<CollectionType, string>> = {
    contributors: "image contributors",
    empty: "entities",
    images: "silhouette images",
    multiple: "entities",
    nodes: "taxonomic groups",
}
const COLLECTION_LABELS: Readonly<Record<CollectionType, string>> = {
    contributors: "Image Contributor Collection",
    empty: "Collection",
    images: "Silhouette Image Collection",
    multiple: "Collection",
    nodes: "Taxonomic Group Collection",
}
const COLLECTION_LABELS_SHORT: Readonly<Record<CollectionType, string>> = {
    contributors: "Image Contributors",
    empty: "Collection",
    images: "Silhouette Images",
    multiple: "Collection",
    nodes: "Taxonomic Groups",
}
const PageComponent: NextPage<Props> = ({ fallback, has, uuid, ...props }) => {
    const type = getCollectionType(has.contributors, has.images, has.nodes)
    return (
        <CompressedSWRConfig fallback={fallback}>
            <PageLayout {...props}>
                <NextSeo
                    canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/collections/${encodeURIComponent(uuid)}`}
                    description={`A collection of ${TYPE_LABELS[type]} from PhyloPic.`}
                    noindex
                    title={`${COLLECTION_LABELS[type]} - PhyloPic`}
                />
                <header>
                    <Breadcrumbs
                        items={[
                            { children: "Home", href: "/" },
                            { children: "Collections" },
                            { children: <strong>{COLLECTION_LABELS_SHORT[type]}</strong> },
                        ]}
                    />
                    <h1>{COLLECTION_LABELS[type]}</h1>
                </header>
                {!has.contributors && !has.images && !has.nodes && <p>This collection is empty.</p>}
                {has.contributors && (
                    <section id="contributors">
                        {(has.images || has.nodes) && <h2>Image Contributors</h2>}
                        <PaginationContainer
                            endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}
                            onPage={customEvents.loadContributorListPage}
                            query={{ filter_collection: uuid }}
                        >
                            {(contributors: readonly Contributor[]) => (
                                <BulletList>
                                    {contributors.map(contributor => (
                                        <li key={contributor.uuid}>
                                            <Link
                                                href={`/contributors/${encodeURIComponent(contributor.uuid)}`}
                                                onClick={() =>
                                                    customEvents.clickContributorLink(
                                                        "collection_contributors",
                                                        contributor,
                                                    )
                                                }
                                            >
                                                {contributor.name}
                                            </Link>
                                        </li>
                                    ))}
                                </BulletList>
                            )}
                        </PaginationContainer>
                    </section>
                )}
                {has.images && (
                    <section id="images">
                        {(has.contributors || has.nodes) && <h2>Silhouette Images</h2>}
                        <LicenseTypeFilterContainer>
                            <ImageLicensePaginator autoLoad query={{ ...IMAGE_QUERY, filter_collection: uuid }}>
                                {(items, total, isLoading) =>
                                    isLoading ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            {total === 0 && <p>There are no silhouette images in this collection.</p>}
                                            {total > 0 && (
                                                <>
                                                    <ImageCollectionUsage items={items} total={total} uuid={uuid} />
                                                    {isNaN(total) && <Loader key="loader" />}
                                                    <br />
                                                    <ImageListView value={items} />
                                                </>
                                            )}
                                        </>
                                    )
                                }
                            </ImageLicensePaginator>
                        </LicenseTypeFilterContainer>
                    </section>
                )}
                {has.nodes && (
                    <section id="nodes">
                        {(has.contributors || has.images) && <h2>Taxonomic Groups</h2>}
                        <PaginationContainer
                            endpoint={process.env.NEXT_PUBLIC_API_URL + "/nodes"}
                            onPage={customEvents.loadNodeListPage}
                            query={{ filter_collection: uuid }}
                        >
                            {nodes => (
                                <BulletList>
                                    {(nodes as readonly Node[]).map(node => (
                                        <li key={node.uuid}>
                                            <Link
                                                href={`/nodes/${encodeURIComponent(node.uuid)}`}
                                                onClick={() => customEvents.clickNodeLink("collection_nodes", node)}
                                            >
                                                <NomenView value={node.names[0]} short />
                                            </Link>
                                        </li>
                                    ))}
                                </BulletList>
                            )}
                        </PaginationContainer>
                    </section>
                )}
            </PageLayout>
        </CompressedSWRConfig>
    )
}
export default PageComponent
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: "blocking",
        paths: [],
    }
}
const getCollectionType = (hasContributors: boolean, hasImages: boolean, hasNodes: boolean): CollectionType => {
    if (hasContributors && !hasImages && !hasNodes) {
        return "contributors"
    }
    if (hasImages && !hasContributors && !hasNodes) {
        return "images"
    }
    if (hasNodes && !hasContributors && !hasImages) {
        return "nodes"
    }
    return "multiple"
}
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDish(uuid)) {
        return { notFound: true }
    }
    if (uuid === EMPTY_UUID) {
        return { props: { has: { contributors: false, images: false, nodes: false }, uuid } }
    }
    const contributorsKey = `${process.env.NEXT_PUBLIC_API_URL}/contributors${createSearch({
        filter_collection: uuid,
    })}`
    const imagesKey = `${process.env.NEXT_PUBLIC_API_URL}/images${createSearch({ filter_collection: uuid })}`
    const nodesKey = `${process.env.NEXT_PUBLIC_API_URL}/nodes${createSearch({ filter_collection: uuid })}`
    const [contributors, images, nodes] = await Promise.all([
        axios.get<List>(contributorsKey),
        axios.get<List>(imagesKey),
        axios.get<List>(nodesKey),
    ])
    const build = contributors.data.build
    return {
        props: {
            build,
            fallback: compressFallback({
                [unstable_serialize(addBuildToURL(contributorsKey, build))]: contributors.data,
                [unstable_serialize(addBuildToURL(imagesKey, build))]: images.data,
                [unstable_serialize(addBuildToURL(nodesKey, build))]: nodes.data,
            }),
            has: {
                contributors: contributors.data.totalItems > 0,
                images: images.data.totalItems > 0,
                nodes: nodes.data.totalItems > 0,
            },
            uuid,
        },
    }
}
