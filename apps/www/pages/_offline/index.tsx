import { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/layout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
const Page: NextPage = () => (
    <PageLayout>
        <NextSeo noindex title="Offline - PhyloPic" />
        <Container>
            <header>
                <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Offline</strong> }]} />
                <h1>Offline</h1>
            </header>
            <p>You appear to be offline. Please reload the page when your Internet connection is re-established.</p>
            <p>
                If you believe this is a bug, please{" "}
                <a href="//github.com/keesey/phylopic/issues/new">report the issue</a>.
            </p>
        </Container>
    </PageLayout>
)
export default Page
