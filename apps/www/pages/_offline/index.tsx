import { NextPage } from "next"
import Head from "next/head"
import PageLayout from "~/pages/PageLayout"
import Breadcrumbs from "~/ui/Breadcrumbs"
const Page: NextPage = () => (
    <PageLayout>
        <Head>
            <title>PhyloPic: Offline</title>
        </Head>
        <header>
            <Breadcrumbs
                items={[
                    { children: "Home", href: "/" },
                    {
                        children: <strong>Offline</strong>,
                    },
                ]}
            />
            <h1>Offline</h1>
            <p>You appear to be offline. Please reload the page when your Internet connection is reestablished.</p>
            <p>
                If you believe this is a bug, please{" "}
                <a href="https://github.com/keesey/phylopic/issues/new">report the issue</a>.
            </p>
        </header>
    </PageLayout>
)
export default Page
