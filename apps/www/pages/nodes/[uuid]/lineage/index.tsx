import { NodeParameters, NodeWithEmbedded } from "@phylopic/api-models"
import { NodeContainer, PaginationContainer, useNomenText } from "@phylopic/ui"
import { createSearch, isUUIDv4, Query, UUID } from "@phylopic/utils"
import { addBuildToURL, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticProps, NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import { FC, useMemo } from "react"
import { SWRConfiguration, unstable_serialize } from "swr"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import useOpenGraphForImage from "~/metadata/useOpenGraphForImage"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import CompressedSWRConfig from "~/swr/CompressedSWRConfig"
import compressFallback from "~/swr/compressFallback"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import LineageView from "~/views/LineageView"
import NomenView from "~/views/NomenView"
const NODE_QUERY: Pick<NodeParameters, "embed_primaryImage"> & Query = { embed_primaryImage: "true" }
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
    const nameString = useNomenText(name, false, "[Unnamed Group]")
    const shortNameStrong = useNomenText(name, true, "[Unnamed Group]")
    const lineageUUID = useMemo(
        () => extractUUIDv4(node._links.parentNode?.href) ?? undefined,
        [node._links.parentNode?.href],
    )
    const openGraph = useOpenGraphForImage(node._embedded.primaryImage)
    return (
        <>
            <NextSeo
                canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/nodes/${encodeURIComponent(node.uuid)}/lineage`}
                description={`Illustrated evolutionary lineage of ${nameString}.`}
                openGraph={openGraph}
                title={`PhyloPic: Lineage of ${shortNameStrong}`}
            />
            <header>
                <ExpandableLineageBreadcrumbs
                    key={node.uuid}
                    afterItems={[
                        {
                            children: (
                                <Link href={`/nodes/` + node.uuid}>
                                    <NomenView value={name} defaultText="[Unnamed Group]" />
                                </Link>
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
    const nodeResult = await fetchResult<NodeWithEmbedded>(nodeKey)
    if (nodeResult.status !== "success") {
        return getStaticPropsResult(nodeResult)
    }
    const build = nodeResult.data.build
    const fallback: NonNullable<SWRConfiguration["fallback"]> = {
        [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data,
    }
    return {
        props: {
            build,
            fallback: compressFallback(fallback),
            uuid,
        },
        revalidate: 3600,
    }
}
