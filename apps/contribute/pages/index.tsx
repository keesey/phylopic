import type { NextPage } from "next"
import dynamic from "next/dynamic"
import PageLayout from "~/pages/PageLayout"
const Registration = dynamic(() => import("~/screens/SignIn"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            description: "Upload your own images to PhyloPic, the open database of freely reusable silhouettes.",
            title: "PhyloPic: Contribute",
            url: "https://contribute.phylopic.org/",
        }}
    >
        <Registration />
    </PageLayout>
)
export default Page
