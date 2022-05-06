import { Node } from "@phylopic/api-models"
import type { NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import NodeListView from "~/views/NodeListView"
export interface Props {
    build: number
    fallback: PublicConfiguration["fallback"]
}
const PageComponent: NextPage<Props> = ({ build, fallback }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="PhyloPic: Taxonomic Groups" url="https://www.phylopic.org/nodes" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/nodes`}>
                            {(nodes, totalNodes) => (
                                <>
                                    <header>
                                        <Breadcrumbs
                                            items={[
                                                { children: "Home", href: "/" },
                                                { children: <strong>Taxonomic Groups</strong> },
                                            ]}
                                        />
                                        <h1>Taxonomic Groups</h1>
                                        <p>
                                            <strong>{totalNodes}</strong> taxonomic groups in the database.
                                        </p>
                                    </header>
                                    <NodeListView short value={nodes as readonly Node[]} />
                                </>
                            )}
                        </PaginationContainer>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
export const getStaticProps = createListStaticPropsGetter<Node>("/nodes")
