import type { NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import NumberAsWords from "~/ui/NumberAsWords"
const Images = dynamic(() => import("~/screens/Images"), { ssr: false })
const Page: NextPage = () => (
    <PageLayout
        breadcrumbs={<a>Accepted Submissions</a>}
        head={{
            title: "PhyloPic: Accepted Submissions",
            url: "https://contribute.phylopic.org/images/accepted",
        }}
    >
        <AuthorizedOnly>
            <Images filter="accepted">
                {total =>
                    typeof total !== "number" ? (
                        <p>Loading accepted submissions…</p>
                    ) : (
                        <p>
                            {total >= 6 && "Wow! "}
                            <strong>
                                <NumberAsWords caps value={total} />
                            </strong>{" "}
                            of your submissions {total === 1 ? "has" : "have"} been accepted.
                            {total < 6 && " Nice!"}
                            {total >= 12 && " Great job! "}
                        </p>
                    )
                }
            </Images>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
