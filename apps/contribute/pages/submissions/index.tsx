import type { NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Submissions from "~/screens/Submissions"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Pending Submissions",
            url: "https://contribute.phylopic.org/submissions",
        }}
    >
        <AuthorizedOnly>
            <Submissions />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
