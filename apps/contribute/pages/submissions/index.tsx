import { Loader } from "@phylopic/client-components"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import NumberAsWords from "~/ui/NumberAsWords"
const Submissions = dynamic(() => import("~/screens/Submissions"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        seo={{
            noindex: true,
            title: "PhyloPic: Current Submissions",
        }}
    >
        <AuthorizedOnly>
            <Suspense fallback={<Loader />}>
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
            </Suspense>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
