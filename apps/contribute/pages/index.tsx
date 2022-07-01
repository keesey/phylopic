import { MountedOnly } from "@phylopic/ui"
import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import Registration from "~/screens/Registration"
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Contribute",
            url: "https://contribute.phylopic.org/",
        }}
    >
        <MountedOnly>
            <Registration />
        </MountedOnly>
    </PageLayout>
)
export default Page
