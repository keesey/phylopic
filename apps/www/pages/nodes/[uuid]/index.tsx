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
    createSearch,
    extractPath,
    extractQueryString,
    isDefined,
    isUUIDv4,
    parseQueryString,
    Query,
    UUID,
} from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { FC, Fragment, useMemo } from "react"
import { SWRConfiguration, unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import CladeImageLicensePaginator from "~/licenses/CladeImageLicensePaginator"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import LicenseQualifier from "~/licenses/LicenseQualifier"
import useOpenGraphImages from "~/metadata/getOpenGraphImages"
import TaxonSchemaScript from "~/metadata/SchemaScript/TaxonSchemaScript"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import NomenHeader from "~/ui/NomenHeader"
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
            <NodeContainer uuid={uuid} query={NODE_QUERY}>
                {node => (node ? <Content node={node} /> : null)}
            </NodeContainer>
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
                ? extractPath(node._links.parentNode.href)
                : undefined,
        [node._embedded.parentNode, node._links.parentNode?.href],
    )
    const parentName = node._embedded?.parentNode?.names?.[0]
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
    const openGraphImages = useOpenGraphImages(node._embedded.primaryImage!)
    return (
        <LicenseTypeFilterContainer>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/nodes/${encodeURIComponent(node.uuid)}`}
                description={`Freely reusable silhouette images of ${nameString}.`}
                openGraph={{ images: openGraphImages }}
                title={`PhyloPic: ${shortNameString}`}
            />
            <TaxonSchemaScript node={node} />
            <header key="header">
                <ExpandableLineageBreadcrumbs
                    key={node.uuid}
                    afterItems={afterItems}
                    beforeItems={[
                        { children: "Home", href: "/" },
                        { children: "Taxonomic Groups", href: "/nodes" },
                    ]}
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
                            <Link href={lineagePath}>
                                Look through the ancestors of{" "}
                                <NomenView value={name} short defaultText="this taxonomic group" /> to find an
                                approximation.
                            </Link>
                        </p>
                    )}
                    <p>
                        Or,{" "}
                        <Link href="/contribute">
                            be the first to contribute a silhouette of{" "}
                            <NomenView value={name} short defaultText="this taxon" />
                            <LicenseQualifier />!
                        </Link>
                    </p>
                </Fragment>
            )}
            {totalImages > 0 && <ImageListView key="images" value={images} />}
        </>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/nodes")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const uuid = context.params?.uuid
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
    if (nodeResult.data.uuid !== uuid) {
        return {
            redirect: {
                destination: "/nodes/" + nodeResult.data.uuid,
                permanent: false,
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
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const pageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getPageKey(0))
            if (pageResponse.ok) {
                fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
    }
    return { props: { build, fallback: compressFallback(fallback), uuid }, revalidate: 3600 }
}
