import type { NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submissions",
            url: "https://contribute.phylopic.org/images",
        }}
    >
        <AuthorizedOnly>:TODO:</AuthorizedOnly>
    </PageLayout>
)
export default Page
