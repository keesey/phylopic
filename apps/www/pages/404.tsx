import { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import PageLayout from "~/layout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
const Page: NextPage = () => (
    <PageLayout>
        <NextSeo noindex title="Incertae Sedis - PhyloPic" />
        <Container>
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
                    <a href="//github.com/keesey/phylopic/issues/new">report the issue</a>.
                </p>
            </header>
        </Container>
    </PageLayout>
)
export default Page
