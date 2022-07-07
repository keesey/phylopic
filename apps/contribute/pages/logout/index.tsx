/* eslint-disable @next/next/no-img-element */
import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import Farewell from "~/screens/Farewell"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Signed Out",
            url: "https://contribute.phylopic.org/logout",
        }}
    >
        <Farewell />
    </PageLayout>
)
export default Page
