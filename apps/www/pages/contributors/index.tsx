import { Contributor, List } from "@phylopic/api-models"
import { AnchorLink, CountView, NumberView, PaginationContainer } from "@phylopic/ui"
import { BuildContainer } from "@phylopic/utils-api"
import type { NextPage } from "next"
import { Fragment } from "react"
import { SWRConfig } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import createListStaticPropsGetter from "~/ssg/createListStaticPropsGetter"
import Board from "~/ui/Board"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SearchOverlay from "~/ui/SearchOverlay"
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
            <PageHead
                title="PhyloPic: Contributors"
                url="https://www.phylopic.org/contributors"
                description="A list of everyone who has contributed free silhouette images to PhyloPic."
            />
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
                                            <CountView value={totalContributors} /> people have contributed silhouette
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
                                            <NumberView key={`count:${uuid}`} value={count} />,
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
