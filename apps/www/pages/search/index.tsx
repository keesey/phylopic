import {
    API,
    Node,
    NodeListParameters,
    NodeWithEmbedded,
    normalizeQuery,
    PageWithEmbedded,
    QueryMatches,
} from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import React from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import PageHead from "~/metadata/PageHead"
import SearchAside from "~/ui/SearchAside"
import SearchOverlay from "~/ui/SearchOverlay"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import { BuildContainer, fetchResult } from "@phylopic/utils-api"
import { getMatchingText, SearchContainer } from "@phylopic/search"
interface Props {
    build?: number
    fallback?: PublicConfiguration["fallback"]
    initialText?: string
}
const PageComponent: NextPage<Props> = ({ build, fallback, initialText }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="Search for Silhouette Images on PhyloPic" url="https://www.phylopic.org/search" />
            <SearchContainer initialText={initialText}>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <header>
                            <Breadcrumbs
                                items={[{ children: "Home", href: "/" }, { children: <strong>Search</strong> }]}
                            />
                            <h1>Search</h1>
                        </header>
                        <SearchAside />
                    </SearchOverlay>
                </main>
                <SiteFooter />
            </SearchContainer>
        </BuildContainer>
    </SWRConfig>
)
export default PageComponent
const getInitialText = (q?: string | string[]) => {
    if (Array.isArray(q)) {
        if (!q.length) {
            return ""
        }
        return q[0] ? normalizeQuery(q[0]) : ""
    }
    if (typeof q === "string") {
        return normalizeQuery(q)
    }
    return ""
}
export const getServerSideProps: GetServerSideProps<Props, { q?: string | string[] }> = async context => {
    const initialText = getInitialText(context.query.q)
    const fallback: PublicConfiguration["fallback"] = {}
    let build: number | undefined
    const endpoint = process.env.NEXT_PUBLIC_API_URL ?? ""
    const response = await fetchResult<API>(endpoint)
    if (response.status === "success") {
        build = response.data.build
        if (initialText) {
            const endpoint =
                process.env.NEXT_PUBLIC_API_URL + "/autocomplete" + createSearch({ build, query: initialText })
            const response = await fetchResult<QueryMatches>(endpoint)
            if (response.status === "success") {
                fallback[endpoint] = response.data
                build = response.data.build
                if (response.data.matches.length) {
                    const matchingText = getMatchingText(response.data.matches, initialText)
                    if (matchingText) {
                        const searchEndpoint =
                            process.env.NEXT_PUBLIC_API_URL +
                            "/nodes" +
                            createSearch({
                                build: build.toString(10),
                                embed_items: "true",
                                embed_primaryImage: "true",
                                filter_name: matchingText,
                                page: "0",
                            } as NodeListParameters & Query)
                        const searchResponse = await fetchResult<PageWithEmbedded<NodeWithEmbedded>>(searchEndpoint)
                        if (searchResponse.status === "success") {
                            fallback[searchEndpoint] = searchResponse.data
                        }
                    }
                }
            }
        }
    }
    return {
        props: {
            ...(build ? { build } : null),
            fallback,
            initialText,
        },
    }
}
