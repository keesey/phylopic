import type { NextPage } from "next"
import Expire from "~/auth/Expire"
import PageLayout from "~/pages/PageLayout"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submissions",
            url: "https://contribute.phylopic.org/submissions",
        }}
    >
        <Expire />
        <p>:TODO:</p>
    </PageLayout>
)
export default Page
