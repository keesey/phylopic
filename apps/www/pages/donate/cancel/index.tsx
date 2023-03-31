import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import Link from "next/link"
import customEvents from "~/analytics/customEvents"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import BulletList from "~/ui/BulletList"
import InlineSections from "~/ui/InlineSections"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/donate/cancel`}
            description="Ways to contribute to PhyloPic, an open database of freely reusable silhouette images of organisms."
            noindex
            title="Other Ways to Contribute to PhyloPic"
        />
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    { children: "Donate", href: "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW" },
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
                    <Link
                        href={`/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}/t-michael-keesey-silhouettes`}
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_author",
                                `/contributors/${process.env.NEXT_PUBLIC_CONTACT_CONTRIBUTOR_UUID}/t-michael-keesey-silhouettes`,
                                "Mike Keesey",
                                "link",
                            )
                        }
                    >
                        Mike Keesey
                    </Link>
                    , like the comic book series{" "}
                    <a
                        href="//www.keesey-comics.com/paleocene"
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_paleocene",
                                "//www.keesey-comics.com/paleocene",
                                "Paleocene",
                                "link",
                            )
                        }
                        rel="external"
                    >
                        <cite>Paleocene</cite>
                    </a>
                    .{" "}
                    <a
                        href="//www.patreon.com/tmkeesey?fan_landing=true"
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_patreon",
                                "//www.patreon.com/tmkeesey?fan_landing=true",
                                "Become a patron!",
                                "link",
                            )
                        }
                        rel="author"
                    >
                        Become a patron!
                    </a>
                </p>
            </section>
            <section>
                <h2>Spread the Word!</h2>
                <p>
                    Tell people about{" "}
                    <a
                        href={`${process.env.NEXT_PUBLIC_WWW_URL}`}
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_spread_word",
                                `${process.env.NEXT_PUBLIC_WWW_URL}`,
                                "PhyloPic",
                                "link",
                            )
                        }
                    >
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
                        <a
                            href="//inkscape.org/support-us"
                            onClick={() =>
                                customEvents.clickLink(
                                    "donate_cancel_inkscape",
                                    "//inkscape.org/support-us",
                                    "Inkscape",
                                    "link",
                                )
                            }
                            rel="external"
                        >
                            Inkscape
                        </a>
                    </li>
                    <li>
                        <a
                            href="//imagemagick.org/script/support.php#support"
                            onClick={() =>
                                customEvents.clickLink(
                                    "donate_cancel_image_magick",
                                    "//imagemagick.org/script/support.php#support",
                                    "ImageMagick",
                                    "link",
                                )
                            }
                            rel="external"
                        >
                            ImageMagick
                        </a>
                    </li>
                    <li>
                        <a
                            href="//opencollective.com/mochajs#support"
                            onClick={() =>
                                customEvents.clickLink(
                                    "donate_cancel_mocha",
                                    "//opencollective.com/mochajs#support",
                                    "Mocha",
                                    "link",
                                )
                            }
                            rel="external"
                        >
                            Mocha
                        </a>
                    </li>
                </BulletList>
            </section>
            <section>
                <h2>Software Engineering</h2>
                <p>
                    If you are technically inclined, check out the{" "}
                    <a
                        href="//github.com/keesey/phylopic"
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_github",
                                "//github.com/keesey/phylopic",
                                "code repository",
                                "link",
                            )
                        }
                    >
                        code repository
                    </a>{" "}
                    and/or the{" "}
                    <a
                        href="http://api-docs.phylopic.org/v2"
                        onClick={() =>
                            customEvents.clickLink(
                                "donate_cancel_api_docs",
                                "http://api-docs.phylopic.org/v2",
                                "API Documentation",
                                "link",
                            )
                        }
                        rel="help"
                    >
                        API Documentation
                    </a>
                    . Think about contributing to <SiteTitle /> or building a tool that uses it.
                </p>
            </section>
            <section>
                <h2>Change Your Mind?</h2>
                <p>
                    Come on, you want to donate <em>something</em> don&rsquo;t you? Right?
                </p>
                <p>
                    <Link
                        href="/donate"
                        onClick={() => customEvents.clickLink("donate_cancel_g0_back", "/donate", "Go Back!", "link")}
                    >
                        Go back!
                    </Link>
                </p>
            </section>
        </InlineSections>
    </PageLayout>
)
export default PageComponent
