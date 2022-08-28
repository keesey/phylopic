import {
    API,
    NodeListParameters,
    NodeWithEmbedded,
    normalizeQuery,
    PageWithEmbedded,
    QueryMatches,
} from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils"
import { fetchResult } from "@phylopic/utils-api"
import type { GetServerSideProps, NextPage } from "next"
import { PublicConfiguration } from "swr/dist/types"
import PageHead from "~/metadata/PageHead"
import PageLayout, { Props as PageLayoutProps } from "~/pages/PageLayout"
import getMatchingText from "~/search/sources/getMatchingText"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SearchAside from "~/ui/SearchAside"
type Props = Omit<PageLayoutProps, "children">
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <PageHead
            title="Search for Silhouette Images on PhyloPic"
            url="https://www.phylopic.org/search"
            description="Search for free silhouette images of animals, plants, and other life forms."
        />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Search</strong> }]} />
            <h1>Search</h1>
        </header>
        <SearchAside />
    </PageLayout>
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
    const endpoint = "https://" + process.env.NEXT_PUBLIC_API_DOMAIN
    const response = await fetchResult<API>(endpoint)
    if (response.status === "success") {
        build = response.data.build
        if (initialText) {
            const endpoint =
                "https://" +
                process.env.NEXT_PUBLIC_API_DOMAIN +
                "/autocomplete" +
                createSearch({ build, query: initialText })
            const response = await fetchResult<QueryMatches>(endpoint)
            if (response.status === "success") {
                fallback[endpoint] = response.data
                build = response.data.build
                if (response.data.matches.length) {
                    const matchingText = getMatchingText(response.data.matches, initialText)
                    if (matchingText) {
                        const searchEndpoint =
                            "https://" +
                            process.env.NEXT_PUBLIC_API_DOMAIN +
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
