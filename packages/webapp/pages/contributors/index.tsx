import { Contributor, List, Page } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import type { GetStaticProps, NextPage } from "next"
import React, { Fragment } from "react"
import { SWRConfig, unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import addBuildToURL from "~/builds/addBuildToURL"
import BuildContainer from "~/builds/BuildContainer"
import fetchData from "~/fetch/fetchData"
import fetchResult from "~/fetch/fetchResult"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import AnchorLink from "~/ui/AnchorLink"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Partial<Pick<List, "build">>
const PageComponent: NextPage<Props> = ({ build, fallback }) => (
    <SWRConfig value={{ fallback }}>
        <BuildContainer initialValue={build}>
            <PageLoader />
            <PageHead title="PhyloPic: Contributors" url="https://www.phylopic.org/contributors" />
            <SearchContainer>
                <header>
                    <SiteNav />
                </header>
                <main>
                    <SearchOverlay>
                        <PaginationContainer endpoint={`${process.env.NEXT_PUBLIC_API_URL}/contributors`}>
                            {(contributors, totalContributors) => (
                                <>
                                    <header>
                                        <Breadcrumbs
                                            items={[
                                                { children: "Home", href: "/" },
                                                { children: <strong>Contributors</strong> },
                                            ]}
                                        />
                                        <h1>Contributors</h1>
                                        <p>
                                            <strong>{totalContributors}</strong> people have contributed silhouette
                                            images to <SiteTitle />.
                                        </p>
                                    </header>
                                    <Board
                                        items={(contributors as readonly Contributor[]).map(({ count, name, uuid }) => [
                                            uuid,
                                            <AnchorLink
                                                key={`link:${uuid}`}
                                                href={`/contributors/${encodeURIComponent(uuid)}`}
                                            >
                                                {name || "Anonymous"}
                                            </AnchorLink>,
                                            <Fragment key={`count:${uuid}`}>
                                                <strong>{count}</strong>
                                            </Fragment>,
                                        ])}
                                    />
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
export const getStaticProps: GetStaticProps<Props, Record<string, never>> = async () => {
    const listKey = process.env.NEXT_PUBLIC_API_URL + "/contributors"
    const listResult = await fetchResult<List>(listKey)
    if (listResult.status !== "success") {
        return getStaticPropsResult(listResult)
    }
    const build = listResult.data.build
    const props: Props = {
        build,
        fallback: { [unstable_serialize(addBuildToURL(listKey, build))]: listResult.data },
    }
    if (listResult.data.totalPages > 0) {
        const getPageKey = (page: number) => listKey + createSearch({ build, page })
        const pageResponse = await fetchData<Page>(getPageKey(0))
        if (pageResponse.ok) {
            props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
        }
    }
    return { props }
}
