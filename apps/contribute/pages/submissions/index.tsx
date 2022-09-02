import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Submissions from "~/screens/Submissions"
import NumberAsWords from "~/ui/NumberAsWords"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Current Submissions",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/submissions`,
        }}
    >
        <AuthorizedOnly>
            <Submissions>
                {total =>
                    typeof total !== "number" ? (
                        <p>Loading current submissions…</p>
                    ) : total ? (
                        <p>
                            You have{" "}
                            <strong>
                                <NumberAsWords value={total} />
                            </strong>{" "}
                            submission{total === 1 ? "" : "s"} awaiting completion or review.
                        </p>
                    ) : (
                        <p>You do not currently have any submissions.</p>
                    )
                }
            </Submissions>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
