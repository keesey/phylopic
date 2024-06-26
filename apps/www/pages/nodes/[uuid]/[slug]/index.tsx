import {
    ImageListParameters,
    ImageWithEmbedded,
    List,
    NodeParameters,
    NodeWithEmbedded,
    PageWithEmbedded,
} from "@phylopic/api-models"
import { Loader, NodeContainer, useNomenText } from "@phylopic/ui"
import {
    Query,
    UUID,
    createSearch,
    extractPath,
    extractQueryString,
    isDefined,
    isUUIDv4,
    parseQueryString,
    shortenNomen,
    stringifyNomen,
} from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { FC, Fragment, useMemo } from "react"
import { SWRConfiguration, unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import customEvents from "~/analytics/customEvents"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import CladeImageLicensePaginator from "~/licenses/CladeImageLicensePaginator"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import LicenseQualifier from "~/licenses/LicenseQualifier"
import TaxonSchemaScript from "~/metadata/SchemaScript/TaxonSchemaScript"
import useOpenGraphForImage from "~/metadata/useOpenGraphForImage"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import getHRefFromAPILink from "~/routes/getHRefFromAPILink"
import getNodeHRef from "~/routes/getNodeHRef"
import getNodeSlug from "~/routes/getNodeSlug"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import Container from "~/ui/Container"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import NomenHeader from "~/ui/NomenHeader"
import QUICK_LINKS from "~/ui/QuickLinks/QUICK_LINKS"
import { QuickLinkNode } from "~/ui/QuickLinks/QuickLinkNode"
import ImageListView from "~/views/ImageListView"
import NodeListView from "~/views/NodeListView"
import NomenView from "~/views/NomenView"
const NODE_QUERY: Omit<NodeParameters, "uuid"> & Query = {
    embed_childNodes: "true",
    embed_parentNode: "true",
    embed_primaryImage: "true",
}
type Props = Omit<PageLayoutProps, "children"> & {
    fallback?: Compressed
    uuid: UUID
}
const PageComponent: NextPage<Props> = ({ fallback, uuid, ...pageLayoutProps }) => (
    <CompressedSWRConfig fallback={fallback}>
        <PageLayout {...pageLayoutProps}>
            <Container>
                <NodeContainer uuid={uuid} query={NODE_QUERY}>
                    {node => (node ? <Content node={node} /> : null)}
                </NodeContainer>
            </Container>
        </PageLayout>
    </CompressedSWRConfig>
)
const Content: FC<{ node: NodeWithEmbedded }> = ({ node }) => {
    const name = node.names[0]
    const nameString = useNomenText(name)
    const shortNameString = useNomenText(name, true)
    const parentHRef = useMemo(
        () =>
            node._links.parentNode?.href &&
            node._embedded.parentNode &&
            nodeHasOwnCladeImages(node._embedded.parentNode)
                ? getHRefFromAPILink(node._links.parentNode)
                : undefined,
        [node._embedded.parentNode, node._links.parentNode],
    )
    const parentName = node._embedded?.parentNode?.names?.[0]
    const keywords = useMemo(
        () =>
            Array.from(
                new Set(
                    [
                        "Creative Commons",
                        "clip art",
                        "clipart",
                        "free art",
                        "phylogeny",
                        "public domain",
                        "silhouettes",
                        `${shortNameString} silhouettes`,
                        ...Array.from(new Set(node.names.map(nomen => stringifyNomen(shortenNomen(nomen))))),
                    ].map(s => s.toLowerCase()),
                ),
            )
                .sort()
                .join(","),
        [node.names, shortNameString],
    )
    const afterItems = useMemo(
        () =>
            [
                parentHRef || parentName
                    ? {
                          children: <NomenView value={parentName} short defaultText="Parent Node" />,
                          href: parentHRef,
                      }
                    : null,
                {
                    children: (
                        <strong>
                            <NomenView value={name} defaultText="[Unnamed]" />
                        </strong>
                    ),
                },
                ...(node._embedded.childNodes?.length
                    ? [
                          {
                              children: <NodeListView value={node._embedded.childNodes ?? []} short />,
                          },
                      ]
                    : []),
            ].filter(isDefined),
        [name, node._embedded.childNodes, parentHRef, parentName],
    )
    const lineageUUID = useMemo(
        () => extractUUIDv4(node._embedded.parentNode?._links.parentNode?.href) ?? undefined,
        [node._embedded.parentNode?._links.parentNode?.href],
    )
    const openGraph = useOpenGraphForImage(node._embedded.primaryImage)
    return (
        <LicenseTypeFilterContainer>
            <NextSeo
                additionalMetaTags={[{ name: "keywords", content: keywords }]}
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/nodes/${encodeURIComponent(node.uuid)}`}
                description={`Freely reusable silhouette images of ${nameString}.`}
                openGraph={openGraph}
                title={`${shortNameString} - PhyloPic`}
            />
            <TaxonSchemaScript node={node} />
            <header key="header">
                <ExpandableLineageBreadcrumbs
                    key={node.uuid}
                    afterItems={afterItems}
                    beforeItems={[{ children: "Home", href: "/" }]}
                    uuid={lineageUUID}
                />
                <NomenHeader value={node} />
            </header>
            <section>
                <h2>Silhouette Images</h2>
                <CladeImageLicensePaginator node={node}>
                    {(images, totalImages) => <ImagesContent images={images} node={node} totalImages={totalImages} />}
                </CladeImageLicensePaginator>
            </section>
        </LicenseTypeFilterContainer>
    )
}
const ImagesContent: FC<{ images: readonly ImageWithEmbedded[]; node: NodeWithEmbedded; totalImages: number }> = ({
    images,
    node,
    totalImages,
}) => {
    const name = node.names[0]
    const lineagePath = useMemo(() => extractPath(node._links.lineage.href) ?? ".", [node._links.lineage.href])
    return (
        <>
            <ImageLicenseControls key="total" total={totalImages} />
            <br />
            {isNaN(totalImages) && <Loader key="loader" />}
            {totalImages === 0 && (
                <Fragment key="empty">
                    {node._links.lineage && (
                        <p>
                            <Link
                                href={lineagePath}
                                onClick={() =>
                                    customEvents.clickLink(
                                        "empty_lineage",
                                        lineagePath,
                                        "Look through the ancestors...",
                                        "link",
                                    )
                                }
                            >
                                Look through the ancestors of{" "}
                                <NomenView value={name} short defaultText="this taxonomic group" /> to find an
                                approximation.
                            </Link>
                        </p>
                    )}
                    <p>
                        Or,{" "}
                        <a
                            href={`${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/`}
                            onClick={() =>
                                customEvents.clickLink(
                                    "empty_contribute",
                                    `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/`,
                                    "be the first to contribute...",
                                    "link",
                                )
                            }
                        >
                            be the first to contribute a silhouette of{" "}
                            <NomenView value={name} short defaultText="this taxon" />
                            <LicenseQualifier />!
                        </a>
                    </p>
                </Fragment>
            )}
            {totalImages > 0 && <ImageListView key="images" value={images} />}
        </>
    )
}
export default PageComponent
const convertQuickLinkToPathParams = (link: QuickLinkNode): Array<{ params: { uuid: UUID; slug: string } }> => [
    { params: { uuid: link.uuid, slug: `${link.slug}-silhouettes` } },
    ...(Array.isArray(link.children)
        ? (link.children as readonly QuickLinkNode[]).reduce<Array<{ params: { uuid: UUID; slug: string } }>>(
              (prev, child) => [...prev, ...convertQuickLinkToPathParams(child)],
              [],
          )
        : []),
]
export const getStaticPaths: GetStaticPaths<{ uuid: UUID; slug: string }> = () => ({
    fallback: "blocking",
    paths: convertQuickLinkToPathParams(QUICK_LINKS),
})
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { slug, uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const nodeQuery = {
        embed_childNodes: "true",
        embed_parentNode: "true",
        embed_primaryImage: "true",
    } as NodeParameters & Query
    const nodeKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + createSearch(nodeQuery)
    const nodeResultPromise = fetchResult<NodeWithEmbedded>(nodeKey)
    const nodeResult = await nodeResultPromise
    if (nodeResult.status !== "success") {
        return getStaticPropsResult(nodeResult)
    }
    if (slug === "lineage") {
        return {
            redirect: {
                destination: `${process.env.NEXT_PUBLIC_WWW_URL}${getNodeHRef(nodeResult.data._links.self)}/lineage`,
                permanent: true,
            },
        }
    }
    if (nodeResult.data.uuid !== uuid || getNodeSlug(nodeResult.data._links.self.title) !== slug) {
        return {
            redirect: {
                destination: `${process.env.NEXT_PUBLIC_WWW_URL}/${getNodeHRef(nodeResult.data._links.self)}`,
                permanent: nodeResult.data.uuid !== uuid,
            },
        }
    }
    const cladeImagesUUID =
        parseQueryString(extractQueryString(nodeResult.data._links.cladeImages?.href ?? "")).filter_clade ?? uuid
    const build = nodeResult.data.build
    const fallback: NonNullable<SWRConfiguration["fallback"]> = {
        [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data,
    }
    const imagesQuery = { filter_clade: cladeImagesUUID } as ImageListParameters & Query
    const imagesKey = process.env.NEXT_PUBLIC_API_URL + "/images" + createSearch(imagesQuery)
    const imagesResponsePromise = fetchData<List>(imagesKey)
    const imagesResponse = await imagesResponsePromise
    if (imagesResponse.ok) {
        fallback[unstable_serialize(addBuildToURL(imagesKey, build))] = imagesResponse.data
        if (imagesResponse.data.totalPages) {
            const getPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, page })
            const pageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getPageKey(0))
            if (pageResponse.ok) {
                fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
    }
    return { props: { build, fallback: compressFallback(fallback), uuid }, revalidate: 3600 }
}
