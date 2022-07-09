/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import CheckEmail from "~/screens/CheckEmail"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Check Your Email",
            url: "https://contribute.phylopic.org/checkemail",
        }}
    >
        <CheckEmail />
    </PageLayout>
)
export default Page
