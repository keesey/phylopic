import type { NextPage } from "next"
import Expire from "~/auth/Expire"
import PageLayout from "~/pages/PageLayout"
import Submissions from "~/screens/Submissions"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submissions",
            url: "https://contribute.phylopic.org/submissions",
        }}
    >
        <Expire />
        <Submissions />
    </PageLayout>
)
export default Page
