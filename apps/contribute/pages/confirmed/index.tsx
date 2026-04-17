import type { NextPage } from "next"
import PageLayout from "~/pages/PageLayout"
import DeletionConfirmed from "~/screens/DeletionConfirmed"
const Page: NextPage = () => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: File Deleted",
        }}
    >
        <DeletionConfirmed />
    </PageLayout>
)
export default Page
