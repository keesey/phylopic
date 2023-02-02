import type { NextPage } from "next"
import { ReactNode } from "react"
import PageHead from "~/metadata/PageHead"
import PageLayout from "~/pages/PageLayout"
import getBuildStaticProps, { Props } from "~/ssg/getBuildStaticProps"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SupportersView from "~/views/SupportersView"
import SUPPORTERS from "~/views/SupportersView/SUPPORTERS"
const NAMES = SUPPORTERS.reduce<readonly ReactNode[]>((prev, supporters) => [...prev, ...supporters.names], [])
const PageComponent: NextPage<Props> = props => (
    <PageLayout {...props}>
        <PageHead title="Special Thanks from PhyloPic" url={`${process.env.NEXT_PUBLIC_WWW_URL}/thanks`} />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Special Thanks</strong> }]} />
            <h1>Special Thanks</h1>
        </header>
        <SupportersView supporters={NAMES} showContributors />
    </PageLayout>
)
export default PageComponent
export const getStaticProps = getBuildStaticProps
