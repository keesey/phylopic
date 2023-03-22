import { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <PageLayout>
        <NextSeo noindex title="PhyloPic: Offline" />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    {
                        children: <strong>Offline</strong>,
                    },
                ]}
            />
            <h1>Offline</h1>
            <p>You appear to be offline. Please reload the page when your Internet connection is reestablished.</p>
            <p>
                If you believe this is a bug, please{" "}
                <a href="//github.com/keesey/phylopic/issues/new">report the issue</a>.
            </p>
        </header>
    </PageLayout>
)
export default Page
