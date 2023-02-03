import { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <PageLayout>
        <NextSeo noindex title="PhyloPic: Incertae Sedis" />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    {
                        children: (
                            <strong>
                                <em>Incertae Sedis</em>
                            </strong>
                        ),
                    },
                ]}
            />
            <h1>
                <em>Incertae Sedis</em>
            </h1>
            <p>
                The page you requested cannot be found. Please try the <Link href="/">Home Page</Link>.
            </p>
            <p>
                If you believe this is a bug, please{" "}
                <a href="https://github.com/keesey/phylopic/issues/new">report the issue</a>.
            </p>
        </header>
    </PageLayout>
)
export default Page
