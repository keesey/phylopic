import axios from "axios"
import type { GetStaticProps, NextPage } from "next"
import { List, Node } from "@phylopic/api-models"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize } from "swr/infinite"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import NodeListView from "~/views/NodeListView"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
export interface Props {
    build: number
    fallback: PublicConfiguration["fallback"]
    total: number
}
const Page: NextPage<Props> = ({ build, fallback, total }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="PhyloPic: Taxonomic Groups" url="https://www.phylopic.org/nodes/" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header>
                            <Breadcrumbs
                                items={[
                                    { children: "Home", href: "/" },
                                    { children: <strong>Taxonomic Groups</strong> },
                                ]}
                            />
                            <h1>Taxonomic Groups</h1>
                            <p>
                                <strong>{total}</strong> taxonomic groups in the database.
                            </p>
                        </header>
                        <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/nodes`}>
                            {value => <NodeListView short value={value as readonly Node[]} />}
                        </PaginationContainer>
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props, {}> = async () => {
    const response = await axios.get<List<Node>>(
        process.env.NEXT_PUBLIC_API_URL + "/nodes" + createQueryString({ start: 0, length: PAGE_SIZE }),
    )
    const ifMatch = getIfMatch(response.headers)
    const loadKey = createPageKeyLoader({
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/nodes`,
        ifMatch,
        pageSize: PAGE_SIZE,
    })
    return {
        props: {
            fallback: {
                [unstable_serialize(loadKey)]: [response.data],
            },
            ifMatch,
            total: response.data.total,
        },
    }
}
