import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Withdrawn Images",
            url: "https://contribute.phylopic.org/images/withdrawn",
        }}
    >
        <AuthorizedOnly>
            <Images filter="withdrawn" />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
