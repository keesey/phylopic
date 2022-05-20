import type { NextPage } from "next"
import React, { ReactNode } from "react"
import { SWRConfig } from "swr"
import BuildContainer from "~/builds/BuildContainer"
import PageHead from "~/metadata/PageHead"
import SearchContainer from "~/search/SearchContainer"
import SearchOverlay from "~/search/SearchOverlay"
import getBuildStaticProps, { Props } from "~/ssg/getBuildStaticProps"
import Breadcrumbs from "~/ui/Breadcrumbs"
import PageLoader from "~/ui/PageLoader"
import SiteFooter from "~/ui/SiteFooter"
import SiteNav from "~/ui/SiteNav"
import SupportersView from "~/views/SupportersView"
import SUPPORTERS from "~/views/SupportersView/SUPPORTERS"
const NAMES = SUPPORTERS.reduce<readonly ReactNode[]>((prev, supporters) => [...prev, ...supporters.names], [])
const PageComponent: NextPage<Props> = ({ build }) => (
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
export default PageComponent
export const getStaticProps = getBuildStaticProps
