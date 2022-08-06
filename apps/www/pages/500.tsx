import { NextPage } from "next"
import Head from "next/head"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <PageLayout>
        <Head>
            <title>PhyloPic: Server Error</title>
        </Head>
        <header>
            <Breadcrumbs items={[{ children: "Home", href: "/" }, { children: <strong>Server Error</strong> }]} />
            <h1>Server Error</h1>
        </header>
        <p>Sorry for the inconvenience. Please check back later.</p>
        <p>
            You may also <a href="https://github.com/keesey/phylopic/issues/new">report the issue</a>.
        </p>
    </PageLayout>
)
export default Page
