import { Loader } from "@phylopic/ui"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Speech from "~/ui/Speech"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Submitted Images",
            url: "https://contribute.phylopic.org/images/submitted",
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
                    ) : (
                        <p>
                            {total === 1 ? "This is the image" : "These are the images"} you have submitted which{" "}
                            {total === 1 ? "is" : "are"} pending review. Click on {total === 1 ? "it" : "any of them"}{" "}
                            if you want to make any changes first.
                        </p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
