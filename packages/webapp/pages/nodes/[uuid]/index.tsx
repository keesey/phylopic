import {
    ImageListParameters,
    ImageWithEmbedded,
    List,
    Node,
    NodeParameters,
    NodeWithEmbedded,
    PageWithEmbedded,
} from "@phylopic/api-models"
import { createSearch, extractPath, isDefined, isUUIDv4, Query } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React, { useMemo } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import addBuildToURL from "~/builds/addBuildToURL"
import BuildContainer from "~/builds/BuildContainer"
import fetchData from "~/fetch/fetchData"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import ImageLicenseControls from "~/licenses/ImageLicenseControls"
import ImageLicensePaginator from "~/licenses/ImageLicensePaginator"
import LicenseTypeFilterContainer from "~/licenses/LicenseFilterTypeContainer"
import LicenseQualifier from "~/licenses/LicenseQualifier"
import PageHead from "~/metadata/PageHead"
import getShortNomen from "~/models/getShortNomen"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createStaticPathsGetter from "~/ssg/createListStaticPathsGetter"
import { EntityPageQuery } from "~/ssg/EntityPageQuery"
import NodeContainer from "~/swr/data/NodeContainer"
import AnchorLink from "~/ui/AnchorLink"
import ExpandableLineageBreadcrumbs from "~/ui/ExpandableLineageBreadcrumbs"
import Loader from "~/ui/Loader"
import NomenHeader from "~/ui/NomenHeader"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import ImageListView from "~/views/ImageListView"
import NodeListView from "~/views/NodeListView"
import NomenView from "~/views/NomenView"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<Node, "build" | "uuid">
const NODE_QUERY: Omit<NodeParameters, "uuid"> & Query = {
    embed_childNodes: "true",
    embed_parentNode: "true",
    embed_primaryImage: "true",
}
const PageComponent: NextPage<Props> = ({ build, fallback, uuid }) => {
    const imagesQuery = useMemo(
        () => ({ embed_specificNode: "true", filter_clade: uuid } as ImageListParameters & Query),
        [uuid],
    )
    return (
        <SWRConfig value={{ fallback }}>
            <BuildContainer initialValue={build}>
                <NodeContainer uuid={uuid} query={NODE_QUERY}>
                    {node => (
                        <LicenseTypeFilterContainer>
                            <PageLoader />
                            <PageHead
                                socialImage={node?._embedded.primaryImage?._links["http://ogp.me/ns#image"]}
                                title={`PhyloPic: ${getShortNomen(node?.names[0])}`}
                                url={`https://www.phylopic.org/nodes/${uuid}`}
                            />
                            <SearchContainer>
                                <header>
                                    <SiteNav />
                                </header>
                                <main>
                                    <SearchOverlay>
                                        <header key="header">
                                            <ExpandableLineageBreadcrumbs
                                                key={uuid}
                                                afterItems={[
                                                    node?._links.parentNode?.href
                                                        ? {
                                                              children: (
                                                                  <NomenView
                                                                      value={node._embedded?.parentNode?.names?.[0]}
                                                                      short
                                                                      defaultText="Parent Node"
                                                                  />
                                                              ),
                                                              href: extractPath(node._links.parentNode.href),
                                                          }
                                                        : null,
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
                                                    ...(node?._embedded.childNodes?.length
                                                        ? [
                                                              {
                                                                  children: (
                                                                      <NodeListView
                                                                          value={node?._embedded.childNodes ?? []}
                                                                          short
                                                                      />
                                                                  ),
                                                              },
                                                          ]
                                                        : []),
                                                ].filter(isDefined)}
                                                beforeItems={[
                                                    { children: "Home", href: "/" },
                                                    { children: "Taxonomic Groups", href: "/nodes" },
                                                ]}
                                                uuid={
                                                    extractUUIDv4(
                                                        node?._embedded.parentNode?._links.parentNode?.href,
                                                    ) ?? undefined
                                                }
                                            />
                                            <NomenHeader value={node} />
                                        </header>
                                        <section>
                                            <h2>Silhouette Images</h2>
                                            <ImageLicensePaginator query={imagesQuery}>
                                                {(images, totalImages) => (
                                                    <>
                                                        <ImageLicenseControls total={totalImages} />
                                                        <br />
                                                        {isNaN(totalImages) && <Loader key="loader" />}
                                                        {totalImages === 0 && (
                                                            <>
                                                                {node?._links.lineage && (
                                                                    <p>
                                                                        <AnchorLink
                                                                            href={
                                                                                extractPath(node._links.lineage.href) ??
                                                                                "."
                                                                            }
                                                                        >
                                                                            Look through the ancestors of{" "}
                                                                            <NomenView
                                                                                value={
                                                                                    (
                                                                                        node as
                                                                                            | NodeWithEmbedded
                                                                                            | undefined
                                                                                    )?.names[0]
                                                                                }
                                                                                short
                                                                                defaultText="this taxonomic group"
                                                                            />{" "}
                                                                            to find an approximation.
                                                                        </AnchorLink>
                                                                    </p>
                                                                )}
                                                                <p>
                                                                    Or,{" "}
                                                                    <AnchorLink href="/contribute">
                                                                        be the first to contribute a silhouette of{" "}
                                                                        <NomenView
                                                                            value={node?.names[0]}
                                                                            short
                                                                            defaultText="this taxon"
                                                                        />
                                                                        <LicenseQualifier />!
                                                                    </AnchorLink>
                                                                </p>
                                                            </>
                                                        )}
                                                        {totalImages > 0 && <ImageListView value={images} />}
                                                    </>
                                                )}
                                            </ImageLicensePaginator>
                                        </section>
                                    </SearchOverlay>
                                </main>
                                <SiteFooter />
                            </SearchContainer>
                        </LicenseTypeFilterContainer>
                    )}
                </NodeContainer>
            </BuildContainer>
        </SWRConfig>
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
    const imagesQuery = { filter_clade: uuid } as ImageListParameters & Query
    const imagesKey = process.env.NEXT_PUBLIC_API_URL + "/images" + createSearch(imagesQuery)
    const nodeResultPromise = fetchResult<NodeWithEmbedded>(nodeKey)
    const imagesResponsePromise = fetchData<List>(imagesKey)
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
    const build = nodeResult.data.build
    const props: Props = {
        build,
        fallback: { [unstable_serialize(addBuildToURL(nodeKey, build))]: nodeResult.data },
        uuid,
    }
    const imagesResponse = await imagesResponsePromise
    if (imagesResponse.ok) {
        props.fallback[unstable_serialize(addBuildToURL(imagesKey, build))] = imagesResponse.data
        if (imagesResponse.data.totalPages) {
            const getPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                "/images" +
                createSearch({ ...imagesQuery, build, embed_items: true, embed_specificNode: true, page })
            const pageResponse = await fetchData<PageWithEmbedded<ImageWithEmbedded>>(getPageKey(0))
            if (pageResponse.ok) {
                props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
    }
    return { props }
}
