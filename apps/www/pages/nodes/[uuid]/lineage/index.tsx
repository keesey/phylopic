import { List, Node, NodeParameters, NodeWithEmbedded, Page } from "@phylopic/api-models"
import { createSearch, isUUIDv4, Query } from "@phylopic/utils"
import { addBuildToURL, BuildContainer, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps, NextPage } from "next"
import React from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import PageHead from "~/metadata/PageHead"
import getShortNomen from "~/models/getShortNomen"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import SearchContainer from "~/search/SearchContainer"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import NodeContainer from "~/swr/data/NodeContainer"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import AnchorLink from "~/ui/AnchorLink"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import LineageView from "~/views/LineageView"
import NomenView from "~/views/NomenView"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<Node, "build" | "uuid">
const NODE_PARAMETERS: Pick<NodeParameters, "embed_primaryImage"> & Query = { embed_primaryImage: "true" }
const PageComponent: NextPage<Props> = ({ build, fallback, uuid }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <NodeContainer uuid={uuid} query={NODE_PARAMETERS}>
                    {node => (
                        <>
                            <PageLoader />
                            <PageHead
                                socialImage={node?._embedded?.primaryImage?._links["http://ogp.me/ns#image"]}
                                title={`PhyloPic: Lineage of ${getShortNomen(node?.names[0])}`}
                                url={`https://www.phylopic.org/nodes/${uuid}/lineage`}
                            />
                            <SearchContainer>
                                <header>
                                    <SiteNav />
                                </header>
                                <main>
                                    <SearchOverlay>
                                        <header>
                                            <ExpandableLineageBreadcrumbs
                                                key={uuid}
                                                afterItems={[
                                                    {
                                                        children: (
                                                            <AnchorLink href={`/nodes/` + uuid}>
                                                                <NomenView
                                                                    value={node?.names[0]}
                                                                    defaultText="[Unnamed]"
                                                                />
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
                                                uuid={extractUUIDv4(node?._links.parentNode?.href) ?? undefined}
                                            />
                                            <h1>
                                                Lineage of{" "}
                                                <NomenView value={node?.names[0]} defaultText="[Unnamed]" short />
                                            </h1>
                                        </header>
                                        <PaginationContainer
                                            endpoint={process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + "/lineage"}
                                        >
                                            {lineageNodes => (
                                                <LineageView
                                                    short
                                                    value={lineageNodes as readonly NodeWithEmbedded[]}
                                                />
                                            )}
                                        </PaginationContainer>
                                    </SearchOverlay>
                                </main>
                                <SiteFooter />
                            </SearchContainer>
                        </>
                    )}
                </NodeContainer>
            </BuildContainer>
        </SWRConfig>
    )
}
export default PageComponent
export const getStaticPaths = createStaticPathsGetter("/nodes")
export const getStaticProps: GetStaticProps<Props, EntityPageQuery> = async context => {
    const { uuid } = context.params ?? {}
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    const nodeKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + createSearch(NODE_PARAMETERS)
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
                    props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
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
                    props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
                }
            }
        })(),
    ])
    return { props }
}
