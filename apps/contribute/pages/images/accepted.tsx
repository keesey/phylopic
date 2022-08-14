import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Accepted Images",
            url: "https://contribute.phylopic.org/images/accepted",
        }}
    >
        <AuthorizedOnly>
            <Images filter="accepted" />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
