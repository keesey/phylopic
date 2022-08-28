import { Loader } from "@phylopic/ui"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submitted Images",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/images/submitted`,
        }}
    >
        <AuthorizedOnly>
            <Images filter="submitted">
                {total =>
                    typeof total !== "number" ? (
                        <>
                            <p>Loading submissions&hellip;</p>
                            <Loader />
                        </>
                    ) : total ? (
                        <p>
                            {total === 1 ? "This is the image" : "These are the images"} you have submitted which{" "}
                            {total === 1 ? "is" : "are"} pending review. There&rsquo;s still time to make revisions, if
                            you want&mdash;just click on {total === 1 ? "it" : "any of them"} to make changes.
                        </p>
                    ) : (
                        <p>You do not have any images pending review.</p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
