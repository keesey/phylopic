import { List, NodeParameters, NodeWithEmbedded, Page } from "@phylopic/api-models"
import { AnchorLink, NodeContainer, PaginationContainer, useNomenText } from "@phylopic/ui"
import { createSearch, isUUIDv4, Query, UUID } from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import { FC, useMemo } from "react"
import { unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import LineageView from "~/views/LineageView"
import NomenView from "~/views/NomenView"
const NODE_QUERY: Pick<NodeParameters, "embed_primaryImage"> & Query = { embed_primaryImage: "true" }
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
    const nameString = useNomenText(name, false, "[Unnamed Group]")
    const shortNameStrong = useNomenText(name, true, "[Unnamed Group]")
    const lineageUUID = useMemo(
        () => extractUUIDv4(node._links.parentNode?.href) ?? undefined,
        [node._links.parentNode?.href],
    )
    return (
        <>
            <PageHead
                description={`Illustrated evolutionary lineage of ${nameString}.`}
                socialImage={node._embedded?.primaryImage?._links["http://ogp.me/ns#image"]}
                title={`PhyloPic: Lineage of ${shortNameStrong}`}
                url={`${process.env.NEXT_PUBLIC_WWW_URL}/nodes/${encodeURIComponent(node.uuid)}/lineage`}
            />
            <header>
                <ExpandableLineageBreadcrumbs
                    key={node.uuid}
                    afterItems={[
                        {
                            children: (
                                <AnchorLink href={`/nodes/` + node.uuid}>
                                    <NomenView value={name} defaultText="[Unnamed Group]" />
                                </AnchorLink>
                            ),
                        },
                        {
                            children: <strong>Lineage</strong>,
                        },
                    ]}
                    beforeItems={[
                        { children: "Home", href: "/" },
                        { children: "Taxonomic Groups", href: "/nodes" },
                    ]}
                    uuid={lineageUUID}
                />
                <h1>
                    Lineage of <NomenView value={name} defaultText="[Unnamed Group]" short />
                </h1>
            </header>
            <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/nodes/" + node.uuid + "/lineage"}>
                {lineageNodes => <LineageView short value={lineageNodes as readonly NodeWithEmbedded[]} />}
            </PaginationContainer>
        </>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/nodes")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const nodeKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + createSearch(NODE_QUERY)
    const listKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + "/lineage"
    const imagesKey = process.env.NEXT_PUBLIC_API_URL + "/images/" + createSearch({ filter_node: uuid })
    const [nodeResult, listResult, imagesResult] = await Promise.all([
        fetchResult<NodeWithEmbedded>(nodeKey),
        fetchResult<List>(listKey),
        fetchResult<List>(imagesKey),
    ])
    if (nodeResult.status !== "success") {
        return getStaticPropsResult(nodeResult)
    }
    if (listResult.status !== "success") {
        return getStaticPropsResult(listResult)
    }
    const build = nodeResult.data.build
    const props: Props = {
        build,
        fallback: {
            ...(imagesResult.ok ? { [unstable_serialize(addBuildToURL(imagesKey, build))]: imagesResult.data } : null),
            [unstable_serialize(addBuildToURL(listKey, build))]: listResult.data,
            [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data,
        },
        uuid,
    }
    await Promise.all([
        (async () => {
            if (listResult.data.totalPages) {
                const getPageKey = (page: number) => listKey + createSearch({ build, embed_items: true, page })
                const pageResponse = await fetchData<Page>(getPageKey(0))
                if (pageResponse.ok) {
                    props.fallback![unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
                }
            }
        })(),
        (async () => {
            if (imagesResult.ok && imagesResult.data.totalPages) {
                const getPageKey = (page: number) =>
                    imagesKey +
                    createSearch({ build, embed_items: true, embed_specificNode: true, filter_node: uuid, page })
                const pageResponse = await fetchData<Page>(getPageKey(0))
                if (pageResponse.ok) {
                    props.fallback![unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
                }
            }
        })(),
    ])
    return { props, revalidate: 3600 }
}
