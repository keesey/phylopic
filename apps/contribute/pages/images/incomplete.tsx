import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submissions in Progress",
            url: "https://contribute.phylopic.org/images/incomplete",
        }}
    >
        <AuthorizedOnly>
            <Images filter="incomplete" />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
