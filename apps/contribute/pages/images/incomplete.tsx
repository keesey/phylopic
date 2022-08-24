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
            <Images filter="incomplete">
                {total =>
                    typeof total !== "number" ? (
                        <p>Loading submissions…</p>
                    ) : total ? (
                        <p>
                            {total === 1 ? "This is a submission" : "These are submissions"} you have started. Very
                            cool! You can click on {total === 1 ? "the image" : "any of the images"} below to complete{" "}
                            {total === 1 ? "it" : "them"}.
                        </p>
                    ) : (
                        <p>You do not currently have any incomplete submissions.</p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
