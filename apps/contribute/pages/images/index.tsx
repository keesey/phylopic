import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import NumberAsWords from "~/ui/NumberAsWords"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        head={{
            title: "PhyloPic: Accepted Submissions",
            url: `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/images`,
        }}
    >
        <AuthorizedOnly>
            <Images>
                {total =>
                    typeof total !== "number" ? (
                        <p>Loading accepted submissions…</p>
                    ) : total ? (
                        <p>
                            {total >= 6 && "Wow! "}
                            <strong>
                                <NumberAsWords caps value={total} />
                            </strong>{" "}
                            of your submissions {total === 1 ? "has" : "have"} been accepted.
                            {total < 6 && " Nice!"}
                            {total >= 12 && " Great job! "}
                        </p>
                    ) : (
                        <p>You do not currently have any accepted submissions.</p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
