import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
const AccountProfile = dynamic(() => import("~/screens/AccountProfile"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: Your Profile",
        }}
    >
        <AuthorizedOnly>
            <Suspense fallback={<LoadingState>Loading your profile…</LoadingState>}>
                <AccountProfile />
            </Suspense>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
