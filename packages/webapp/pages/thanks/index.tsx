import axios from "axios"
import type { GetStaticProps, NextPage } from "next"
import { Contributor, List } from "@phylopic/api-models"
import React, { ReactNode } from "react"
import { SWRConfig } from "swr"
import { unstable_serialize } from "swr/infinite"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createPageKeyLoader from "~/swr/pagination/createPageKeyLoader"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import createQueryString from "~/utils/createQueryString"
import getIfMatch from "~/utils/getIfMatch"
import SupportersView from "~/views/SupportersView"
import SUPPORTERS from "~/views/SupportersView/SUPPORTERS"
const NAMES = SUPPORTERS.reduce<readonly ReactNode[]>((prev, supporters) => [...prev, ...supporters.names], [])
export interface Props {
    ifMatch: string
}
const Page: NextPage<Props> = ({ ifMatch }) => (
    <SWRConfig>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="Special Thanks from PhyloPic" url="https://www.phylopic.org/thanks" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header>
                            <Breadcrumbs
                                items={[{ children: "Home", href: "/" }, { children: <strong>Special Thanks</strong> }]}
                            />
                            <h1>Special Thanks</h1>
                        </header>
                        <SupportersView supporters={NAMES} showContributors />
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default Page
export const getStaticProps: GetStaticProps<Props> = async () => {
    const response = await axios.get<List<Contributor>>(
        process.env.NEXT_PUBLIC_API_URL + "/contributors?" + createQueryString({ start: 0, length: 64 }),
    )
    const ifMatch = getIfMatch(response.headers)
    const loadKey = createPageKeyLoader({
        endpoint: `${process.env.NEXT_PUBLIC_API_URL}/contributors`,
        ifMatch,
        pageSize: 64,
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
