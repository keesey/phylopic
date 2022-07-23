import type { NextPage } from "next"
import dynamic from "next/dynamic"
import PageLayout from "~/pages/PageLayout"
const Home = dynamic(() => import("~/pages/Home"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            description: "Upload your own images to PhyloPic, the open database of freely reusable silhouettes.",
            index: true,
            title: "PhyloPic: Contribute",
            url: "https://contribute.phylopic.org/",
        }}
    >
        <Home />
    </PageLayout>
)
export default Page
