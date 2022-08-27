import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const AccountProfile = dynamic(() => import("~/screens/AccountProfile"))
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Profile",
            url: "https://contribute.phylopic.org/profile",
        }}
    >
        <AuthorizedOnly>
            <AccountProfile />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page