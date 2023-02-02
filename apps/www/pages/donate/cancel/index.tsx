import type { NextPage } from "next"
import Link from "next/link"
import PageHead from "~/metadata/PageHead"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BulletList from "~/ui/BulletList"
import InlineSections from "~/ui/InlineSections"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <PageHead
            description="Ways to contribute to PhyloPic, an open database of freely reusable silhouette images of organisms."
            title="PhyloPic: Other Ways to Contribute"
            url={`${process.env.NEXT_PUBLIC_WWW_URL}/contribute/cancel`}
        />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    { children: "Donate", href: "/donate" },
                    { children: <strong>Other Ways to Contribute</strong> },
                ]}
            />
            <p>
                <strong>
                    Decided not to donate to <SiteTitle />?
                </strong>{" "}
                That’s O.K., there are…
            </p>
            <h1>Other Ways to Contribute</h1>
        </header>
        <InlineSections>
            <section>
                <h2>Upload a Silhouette</h2>
                <p>
                    <SiteTitle /> relies on silhouettes uploaded by people like you! Use the{" "}
                    <a href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}>Image Uploader</a> to add your artwork the
                    database of freely reusable images!
                </p>
                <p></p>
            </section>
            <section>
                <h2>Become a Patron</h2>
                <p>
                    For as little as $1 a month, you can see previews of new <SiteTitle /> functionality, as well as
                    updates on other projects by{" "}
                    <Link href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}`}>Mike Keesey</Link>,
                    like the comic book series{" "}
                    <a href="https://www.keesey-comics.com/paleocene" rel="external">
                        <cite>Paleocene</cite>
                    </a>
                    . <a href="https://www.patreon.com/tmkeesey?fan_landing=true">Become a patron!</a>
                </p>
            </section>
            <section>
                <h2>Spread the Word!</h2>
                <p>
                    Tell people about{" "}
                    <a href={`${process.env.NEXT_PUBLIC_WWW_URL}`}>
                        <SiteTitle />
                    </a>
                    !
                </p>
            </section>
            <section>
                <h2>Support Free Technologies</h2>
                <p>
                    <SiteTitle /> relies on a number of free, open-source technologies. Support them instead! Here are a
                    few:
                </p>
                <BulletList>
                    <li>
                        <a href="https://inkscape.org/support-us/" rel="external">
                            Inkscape
                        </a>
                    </li>
                    <li>
                        <a href="https://imagemagick.org/script/support.php#support" rel="external">
                            ImageMagick
                        </a>
                    </li>
                    <li>
                        <a href="https://opencollective.com/mochajs#support" rel="external">
                            Mocha
                        </a>
                    </li>
                </BulletList>
            </section>
            <section>
                <h2>Software Engineering</h2>
                <p>
                    If you are technically inclined, check out the{" "}
                    <a href="https://github.com/keesey/phylopic">code repository</a> and/or the{" "}
                    <a href="http://api-docs.phylopic.org/2.0">API Documentation</a>. Think about contributing to{" "}
                    <SiteTitle /> or building a tool that uses it.
                </p>
            </section>
            <section>
                <h2>Change Your Mind?</h2>
                <p>
                    Come on, you want to donate <em>something</em> don’t you? Right?
                </p>
                <p>
                    <Link href="/donate">Go back!</Link>
                </p>
            </section>
        </InlineSections>
    </PageLayout>
)
export default PageComponent
