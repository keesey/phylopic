import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import { ReactNode } from "react"
import PageLayout from "~/layout"
import getBuildStaticProps, { Props } from "~/ssg/getBuildStaticProps"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import SupportersView from "~/views/SupportersView"
import SUPPORTERS from "~/views/SupportersView/SUPPORTERS"
const NAMES = SUPPORTERS.reduce<readonly ReactNode[]>((prev, supporters) => [...prev, ...supporters.names], [])
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <NextSeo canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/thanks`} title="Special Thanks from PhyloPic" />
        <Container>
            <header>
                <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Special Thanks</strong> }]} />
                <h1>Special Thanks</h1>
            </header>
            <SupportersView supporters={NAMES} showContributors />
        </Container>
    </PageLayout>
)
export default PageComponent
export const getStaticProps = getBuildStaticProps
