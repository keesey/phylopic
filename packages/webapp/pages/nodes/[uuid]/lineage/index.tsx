import { List, Node, NodeListParameters, NodeParameters, NodeWithEmbedded, Page } from "@phylopic/api-models"
import { createSearch, isDefined, isUUIDv4, Query, UUID } from "@phylopic/utils"
import type { GetStaticPaths, GetStaticPathsResult, GetStaticProps, NextPage } from "next"
import { ParsedUrlQuery } from "querystring"
import React, { useMemo } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import addBuildToURL from "~/builds/addBuildToURL"
import BuildContainer from "~/builds/BuildContainer"
import fetchData from "~/fetch/fetchData"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import useNameText from "~/hooks/useNameText"
import PageHead from "~/metadata/PageHead"
import getShortName from "~/models/getShortName"
import extractUUIDv4 from "~/routes/extractUUID"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import DataContainer from "~/swr/data/DataContainer"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import LineageView from "~/views/LineageView"
import NameView from "~/views/NameView"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<Node, "build" | "uuid">
const Page: NextPage<Props> = ({ build, fallback, uuid }) => {
    const nodeEndpoint = useMemo(
        () => process.env.NEXT_PUBLIC_API_URL + "/nodes/" + uuid + createSearch({ embed_primaryImage: "true" }),
        [uuid],
    )
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <DataContainer endpoint={nodeEndpoint}>
                    {node => (
                        <>
                            <PageLoader />
                            <PageHead
                                socialImage={
                                    (node as NodeWithEmbedded | undefined)?._embedded?.primaryImage?._links[
                                        "http://ogp.me/ns#image"
                                    ]
                                }
                                title={`PhyloPic: Lineage of ${getShortName(
                                    (node as NodeWithEmbedded | undefined)?.names[0],
                                )}`}
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
                                                                <NameView
                                                                    value={
                                                                        (node as NodeWithEmbedded | undefined)?.names[0]
                                                                    }
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
                                                uuid={extractUUIDv4(
                                                    (node as NodeWithEmbedded | undefined)?._links.parentNode?.href,
                                                )}
                                            />
                                            <h1>
                                                Lineage of{" "}
                                                <NameView
                                                    value={(node as NodeWithEmbedded | undefined)?.names[0]}
                                                    defaultText="[Unnamed]"
                                                    short
                                                />
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
                </DataContainer>
            </BuildContainer>
        </SWRConfig>
    )
}
export default Page
type PageQuery = ParsedUrlQuery & { uuid: UUID }
export const getStaticPaths: GetStaticPaths<PageQuery> = async () => {
    const parameters: NodeListParameters & Query = { page: "0" }
    const response = await fetchData<Page>(process.env.NEXT_PUBLIC_API_URL + "/nodes" + createSearch(parameters))
    if (!response.ok) {
        console.error(response)
        return {
            fallback: "blocking",
            paths: [],
        }
    }
    const paths: GetStaticPathsResult<PageQuery>["paths"] =
        response.data._links.items
            .map(link => extractUUIDv4(link.href))
            .filter(isDefined)
            .map(uuid => ({
                params: { uuid },
            })) ?? []
    return {
        fallback: "blocking",
        paths,
    }
}
export const getStaticProps: GetStaticProps<Props, PageQuery> = async context => {
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
