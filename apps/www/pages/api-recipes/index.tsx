import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import CurlBox from "~/ui/CurlBox"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/api-recipes`}
            description="A gentle introduction for software engineers to the PhyloPic Application Programming Interface (API). Examples including searching for silhouette images of biological taxa.s"
            title="Code Recipes for the PhyloPic API"
        />
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>API Recipes</strong> }]} />
            <h1>
                <abbr title="Application Programming Interface">API</abbr> Recipes
            </h1>
        </header>
        <article>
            <section id="introduction">
                <CurlBox url={process.env.NEXT_PUBLIC_API_URL ?? ""} />
            </section>
            <section id="builds">
                <h2>Builds</h2>
            </section>
            <section id="lists">
                <h2>Lists</h2>
            </section>
            <section id="choosing-image">
                <h2>Choosing an Image</h2>
            </section>
            <section id="searching-name">
                <h2>Searching for a Taxonomic Name</h2>
                <section id="searching-name-phylopic">
                    <h3>
                        In <SiteTitle />
                        &rsquo;s Database
                    </h3>
                </section>
                <section id="searching-name-otol">
                    <h3>
                        In <cite>Open Tree of Life</cite>
                    </h3>
                </section>
                <section id="searching-name-pbdb">
                    <h3>
                        In <cite>Paleobiology Database</cite>
                    </h3>
                </section>
                <section id="searching-name-eol">
                    <h3>
                        In <cite>Encyclopedia of Life</cite>
                    </h3>
                </section>
            </section>
        </article>
    </PageLayout>
)
export default PageComponent
