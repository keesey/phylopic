import type { NextPage } from "next"
import MailingListForm from "~/forms/MailingListForm"
import PageHead from "~/metadata/PageHead"
import SchemaScript from "~/metadata/SchemaScript"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
import SiteTitle from "~/ui/SiteTitle"
const PageComponent: NextPage = () => (
    <PageLayout>
        <PageHead
            description="Get updates on new features for PhyloPic, the open database of freely reusable silhouette images of organisms."
            title="Sign up for the PhyloPic Mailing List"
            url={`${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`}
        >
            <SchemaScript
                id="MediaSubscription"
                object={{
                    "@context": "https://schema.org",
                    "@type": "MediaSubscription",
                    "@id": `${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`,
                    description: "Newsletter for PhyloPic.",
                    name: "PhyloPic Mailing List",
                    url: `${process.env.NEXT_PUBLIC_WWW_URL}/mailinglist`,
                }}
            />
        </PageHead>
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Mailing List</strong> }]} />
            <h1>
                <SiteTitle /> Mailing List
            </h1>
        </header>
        <section>
            <p>
                Subscribe to the <SiteTitle /> newsletter to receives updates about the site&mdash;improvements, new
                features, and more!
            </p>
            <MailingListForm />
        </section>
    </PageLayout>
)
export default PageComponent
