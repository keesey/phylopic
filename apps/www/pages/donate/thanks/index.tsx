import type { NextPage } from "next"
import { NextSeo } from "next-seo"
import customEvents from "~/analytics/customEvents"
import PageLayout from "~/pages/PageLayout"
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
            canonical={`${process.env.NEXT_PUBLIC_WWW_URL}/donate/thanks`}
            noindex
            title="Thank You from PhyloPic!"
        />
        <Container>
            <header>
                <Breadcrumbs
                    items={[
                        { children: "Home", href: "/" },
                        { children: "Donate", href: "/donate" },
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
                            <SiteTitle /> relies on a number of free, open-source technologies. Support them as well!
                            Here are a few:
                        </p>
                        <TechDonateList />
                    </section>
                    <section>
                        <h3>Upload a Silhouette</h3>
                        <p>
                            <SiteTitle /> relies on silhouettes uploaded by people like you! Use the{" "}
                            <a
                                href={process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/"}
                                onClick={() =>
                                    customEvents.clickLink(
                                        "donate_thanks_contribute",
                                        process.env.NEXT_PUBLIC_CONTRIBUTE_URL + "/",
                                        "Image Uploader",
                                        "link",
                                    )
                                }
                            >
                                Image Uploader
                            </a>{" "}
                            to add your artwork the database of freely reusable images!
                        </p>
                    </section>
                    <PatreonSection />
                    <EngineeringSection />
                    <SpreadWordSection />
                </InlineSections>
            </section>
        </Container>
    </PageLayout>
)
export default PageComponent
