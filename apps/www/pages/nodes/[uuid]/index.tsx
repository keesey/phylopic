import {
    ImageListParameters,
    ImageWithEmbedded,
    List,
    NodeParameters,
    NodeWithEmbedded,
    PageWithEmbedded,
} from "@phylopic/api-models"
import { AnchorLink, Loader, NodeContainer, useNomenText } from "@phylopic/ui"
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
import type { GetStaticProps, NextPage } from "next"
import { FC, Fragment, useMemo } from "react"
import { unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import CladeImageLicensePaginator from "~/licenses/CladeImageLicensePaginator"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import LicenseQualifier from "~/licenses/LicenseQualifier"
import PageHead from "~/metadata/PageHead"
import TaxonSchemaScript from "~/metadata/SchemaScript/TaxonSchemaScript"
import nodeHasOwnCladeImages from "~/models/nodeHasOwnCladeImages"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
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
    uuid: UUID
}
const PageComponent: NextPage<Props> = ({ uuid, ...pageLayoutProps }) => (
    <PageLayout {...pageLayoutProps}>
        <NodeContainer uuid={uuid} query={NODE_QUERY}>
            {node => (node ? <Content node={node} /> : null)}
        </NodeContainer>
    </PageLayout>
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
    return (
        <LicenseTypeFilterContainer>
            <PageHead
                description={`Freely reusable silhouette images of ${nameString}.`}
                socialImage={node._embedded.primaryImage?._links["http://ogp.me/ns#image"]}
                title={`PhyloPic: ${shortNameString}`}
                url={`https://www.phylopic.org/nodes/${node.uuid}`}
            >
                <TaxonSchemaScript node={node} />
            </PageHead>
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
                            <AnchorLink href={lineagePath}>
                                Look through the ancestors of{" "}
                                <NomenView value={name} short defaultText="this taxonomic group" /> to find an
                                approximation.
                            </AnchorLink>
                        </p>
                    )}
                    <p>
                        Or,{" "}
                        <AnchorLink href="/contribute">
                            be the first to contribute a silhouette of{" "}
                            <NomenView value={name} short defaultText="this taxon" />
                            <LicenseQualifier />!
                        </AnchorLink>
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
    const nodeKey = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/nodes/" + uuid + createSearch(nodeQuery)
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
    const props: Props = {
        build,
        fallback: { [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data },
        uuid,
    }
    const imagesQuery = { filter_clade: cladeImagesUUID } as ImageListParameters & Query
    const imagesKey = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/images" + createSearch(imagesQuery)
    const imagesResponsePromise = fetchData<List>(imagesKey)
    const imagesResponse = await imagesResponsePromise
    if (imagesResponse.ok) {
        props.fallback![unstable_serialize(addBuildToURL(imagesKey, build))] = imagesResponse.data
        if (imagesResponse.data.totalPages) {
            const getPageKey = (page: number) =>
                "https://" +
                process.env.NEXT_PUBLIC_API_DOMAIN +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const pageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getPageKey(0))
            if (pageResponse.ok) {
                props.fallback![unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
    }
    return { props, revalidate: 3600 }
}
