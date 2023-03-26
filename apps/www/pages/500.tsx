import { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <PageLayout>
        <NextSeo noindex title="Server Error - PhyloPic" />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Server Error</strong> }]} />
            <h1>Server Error</h1>
        </header>
        <p>Sorry for the inconvenience. Please check back later.</p>
        <p>
            You may also <a href="//github.com/keesey/phylopic/issues/new">report the issue</a>.
        </p>
    </PageLayout>
)
export default Page
