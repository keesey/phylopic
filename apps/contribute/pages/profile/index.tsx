import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Speech from "~/ui/Speech"
const AccountDetails = dynamic(() => import("~/screens/AccountDetails"))
const Page: NextPage = () => {
    const router = useRouter()
    return (
        <PageLayout
            head={{
                title: "PhyloPic: Your Profile",
                url: "https://contribute.phylopic.org/profile",
            }}
        >
            <AuthorizedOnly>
                <AccountDetails onComplete={() => router.push("/")}>
                    <Speech mode="system">
                        <p>Want to make any changes to your account profile?</p>
                        <p>(They won&rsquo;t show until the next build.)</p>
                    </Speech>
                </AccountDetails>
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
