import { List, Node, NodeParameters, NodeWithEmbedded, Page } from "@phylopic/api-models"
import { createSearch, isUUIDv4, Query } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import addBuildToURL from "~/builds/addBuildToURL"
import BuildContainer from "~/builds/BuildContainer"
import fetchData from "~/fetch/fetchData"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import PageHead from "~/metadata/PageHead"
import getShortNomen from "~/models/getShortNomen"
import extractUUIDv4 from "~/routes/extractUUID"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import NodeContainer from "~/swr/data/NodeContainer"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import LineageView from "~/views/LineageView"
import NomenView from "~/views/NomenView"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<Node, "build" | "uuid">
const PageComponent: NextPage<Props> = ({ build, fallback, uuid }) => {
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <NodeContainer uuid={uuid}>
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
                                                            <strong>
                                                                <NomenView
                                                                    value={node?.names[0]}
                                                                    defaultText="[Unnamed]"
                                                                />
                                                            </strong>
                                                        ),
                                                    },
                                                    {
                                                        children: "Lineage",
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
                                            endpoint={`${process.env.NEXT_PUBLIC_API_URL}/nodes/${uuid}/lineage`}
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
    const nodeParameters: Omit<NodeParameters, "uuid"> & Query = { embed_primaryImage: "true" }
    const baseKey = process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid
    const nodeKey = baseKey + createSearch(nodeParameters)
    const listKey = baseKey + "/lineage"
    const [nodeResult, listResult] = await Promise.all([
        fetchResult<NodeWithEmbedded>(nodeKey),
        fetchResult<List>(listKey),
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
            [unstable_serialize(addBuildToURL(listKey, build))]: listResult.data,
            [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data,
        },
        uuid,
    }
    if (listResult.data.totalPages) {
        const getPageKey = (page: number) => listKey + createSearch({ build, page })
        const pageResponse = await fetchData<Page>(getPageKey(0))
        if (pageResponse.ok) {
            props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
        }
    }
    return { props }
}
