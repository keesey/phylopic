import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import Container from "~/ui/Container"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/articles`}
            description="Articles about PhyloPic, the open database of free organism silhouettes."
            title="PhyloPic Articles"
        />
        <Container>
            <header>
                <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Articles</strong> }]} />
                <h1>Articles</h1>
            </header>
            <nav>
                <ul>
                    <li>
                        <h2>
                            <Link href="/articles/api-recipes">
                                <cite>
                                    <abbr title="Application Programming Interface">API</abbr> Recipes
                                </cite>
                            </Link>{" "}
                        </h2>
                        <div style={{ textAlign: "right" }}>
                            by{" "}
                            <Link
                                href="/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes"
                                rel="author"
                            >
                                T. Michael Keesey
                            </Link>
                        </div>
                        <p>
                            A gentle introduction for software engineers to the <SiteTitle />{" "}
                            <abbr title="Application Programming Interface">API</abbr>. Examples including searching for
                            silhouette images of biological taxa.
                        </p>
                    </li>
                    <li>
                        <h2>
                            <Link href="/articles/image-usage">
                                <cite>
                                    Usage of <SiteTitle /> Images
                                </cite>
                            </Link>{" "}
                        </h2>
                        <div style={{ textAlign: "right" }}>
                            by{" "}
                            <Link
                                href="/contributors/060f03a9-fafd-4d08-81d1-b8f82080573f/t-michael-keesey-silhouettes"
                                rel="author"
                            >
                                T. Michael Keesey
                            </Link>
                        </div>
                        <p>
                            How to follow the licensing requirements for silhouette images on <SiteTitle />, including
                            instructions for creating custom collections of multiple images.
                        </p>
                    </li>
                </ul>
            </nav>
        </Container>
    </PageLayout>
)
export default PageComponent
