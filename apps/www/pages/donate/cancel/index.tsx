import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import customEvents from "~/analytics/customEvents"
import PageLayout from "~/layout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import EngineeringSection from "~/sections/EngineeringSection"
import InlineSections from "~/ui/InlineSections"
import PatreonSection from "~/sections/PatreonSection"
import SiteTitle from "~/ui/SiteTitle"
import SpreadWordSection from "~/sections/SpreadWordSection"
import TechDonateList from "~/sections/TechDonateList"
import Container from "~/ui/Container"
const PageComponent: NextPage = () => (
    <PageLayout>
        <NextSeo
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/donate/cancel`}
            description="Ways to contribute to PhyloPic, an open database of freely reusable silhouette images of organisms."
            noindex
            title="Other Ways to Contribute to PhyloPic"
        />
        <Container>
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
                        <a href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}>Image Uploader</a> to add your artwork
                        the database of freely reusable images!
                    </p>
                    <p></p>
                </section>
                <PatreonSection />
                <SpreadWordSection />
                <section>
                    <h2>Support Free Technologies</h2>
                    <p>
                        <SiteTitle /> relies on a number of free, open-source technologies. Support them instead! Here
                        are a couple:
                    </p>
                    <TechDonateList />
                </section>
                <EngineeringSection />
                <section>
                    <h2>Change Your Mind?</h2>
                    <p>
                        Come on, you want to donate <em>something</em> don&rsquo;t you? Right?
                    </p>
                    <p>
                        <a
                            href="//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW"
                            onClick={() =>
                                customEvents.clickLink(
                                    "donate_cancel_go_back",
                                    "//www.paypal.com/donate/?hosted_button_id=9GL697FDK7ZWW",
                                    "Go Back!",
                                    "link",
                                )
                            }
                            rel="noreferrer"
                        >
                            Go back!
                        </a>
                    </p>
                </section>
            </InlineSections>
        </Container>
    </PageLayout>
)
export default PageComponent
