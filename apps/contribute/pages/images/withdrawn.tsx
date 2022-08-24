import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import NumberAsWords from "~/ui/NumberAsWords"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Withdrawn Submissions",
            url: "https://contribute.phylopic.org/images/withdrawn",
        }}
    >
        <AuthorizedOnly>
            <Images filter="withdrawn">
                {total =>
                    typeof total !== "number" ? (
                        <p>Loading withdrawn submissions…</p>
                    ) : (
                        <p>
                            You have withdrawn <NumberAsWords value={total} /> of your submissions. Click on{" "}
                            {total === 1 ? "it" : "any of them"} to reconsider.
                        </p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
