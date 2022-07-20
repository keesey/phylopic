import type { NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Images from "~/screens/Images"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Accepted Images",
            url: "https://contribute.phylopic.org/images",
        }}
    >
        <AuthorizedOnly>
            <Images />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
