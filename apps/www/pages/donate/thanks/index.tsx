import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BulletList from "~/ui/BulletList"
import InlineSections from "~/ui/InlineSections"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/donate/thanks`}
            noindex
            title="Thank You from PhyloPic!"
        />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    { children: "Donate", href: "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW" },
                    { children: <strong>Thanks for Your Donation</strong> },
                ]}
            />
            <h1>Thank you so much!</h1>
        </header>
        <section>
            <p>
                Your generous donation will help keep <SiteTitle /> online. Thousands of educators, researchers, and
                students will be able to search the taxonomic database for freely reusable silhouettes{" "}
                <strong>thanks to you!</strong>
            </p>
        </section>
        <section>
            <h2>Other Ways to Help Out</h2>
            <InlineSections>
                <section>
                    <h3>Support Free Technologies</h3>
                    <p>
                        <SiteTitle /> relies on a number of free, open-source technologies. Support them as well! Here
                        are a few:
                    </p>
                    <BulletList>
                        <li>
                            <a href="//inkscape.org/support-us/" rel="external">
                                Inkscape
                            </a>
                        </li>
                        <li>
                            <a href="//imagemagick.org/script/support.php#support" rel="external">
                                ImageMagick
                            </a>
                        </li>
                        <li>
                            <a href="//opencollective.com/mochajs#support" rel="external">
                                Mocha
                            </a>
                        </li>
                    </BulletList>
                </section>
                <section>
                    <h3>Upload a Silhouette</h3>
                    <p>
                        <SiteTitle /> relies on silhouettes uploaded by people like you! Use the{" "}
                        <a href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}>Image Uploader</a> to add your artwork
                        the database of freely reusable images!
                    </p>
                    <p></p>
                </section>
                <section>
                    <h3>Become a Patron</h3>
                    <p>
                        For as little as $1 a month, you can see previews of new <SiteTitle /> functionality, as well as
                        updates on other projects by{" "}
                        <Link href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`} rel="author">
                            Mike Keesey
                        </Link>
                        , like the comic book series{" "}
                        <a href="//www.keesey-comics.com/paleocene" rel="external">
                            <cite>Paleocene</cite>
                        </a>
                        .{" "}
                        <a href="//www.patreon.com/tmkeesey?fan_landing=true" rel="author">
                            Become a patron!
                        </a>
                    </p>
                </section>
                <section>
                    <h3>Software Engineering</h3>
                    <p>
                        If you are technically inclined, check out the{" "}
                        <a href="//github.com/keesey/phylopic">code repository</a> and/or the{" "}
                        <a href="http://api-docs.phylopic.org/v2" rel="help">
                            API Documentation
                        </a>
                        . Think about contributing to <SiteTitle /> or building a tool that uses it.
                    </p>
                </section>
                <section>
                    <h3>Spread the Word!</h3>
                    <p>
                        Tell people about{" "}
                        <a href={`${process.env.NEXT_PUBLIC_WWW_URL}`}>
                            <SiteTitle />
                        </a>
                        !
                    </p>
                </section>
            </InlineSections>
        </section>
    </PageLayout>
)
export default PageComponent
