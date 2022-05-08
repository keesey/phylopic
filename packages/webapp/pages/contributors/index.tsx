import { Contributor, List } from "@phylopic/api-models"
import type { NextPage } from "next"
import React, { Fragment } from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import PaginationContainer from "~/swr/pagination/PaginationContainer"
import AnchorLink from "~/ui/AnchorLink"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SiteTitle from "~/ui/SiteTitle"
import NumberView from "~/views/NumberView"
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
                        <PaginationContainer endpoint={process.env.NEXT_PUBLIC_API_URL + "/contributors"}>
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
                                            <NumberView value={totalContributors} /> people have contributed silhouette
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
export const getStaticProps = createListStaticPropsGetter<Contributor>("/contributors")
