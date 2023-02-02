import { Hash, isHash } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
import SourceClient from "~/source/SourceClient"
const Usage = dynamic(() => import("~/screens/Usage"), { ssr: false })
type Props = {
    hash: Hash
}
const Page: NextPage<Props> = ({ hash }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Usage of Your Submission",
            url: `${process.env.NEXT_PUBLIC_CONTRIBUTE_URL}/edit/${encodeURIComponent(hash)}/usage`,
        }}
        submissionHash={hash}
    >
        <AuthorizedOnly>
            <Suspense fallback={<LoadingState>One moment…</LoadingState>}>
                <Usage hash={hash} />
            </Suspense>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const hash = context.params?.hash
    if (!isHash(hash)) {
        return { notFound: true }
    }
    let client: SourceClient | undefined
    let notFound = false
    try {
        client = new SourceClient()
        const submissionClient = client.submission(hash)
        if (!(await submissionClient.exists())) {
            notFound = true
        }
    } finally {
        client?.destroy()
    }
    if (notFound) {
        return { notFound }
    }
    return {
        props: { hash },
    }
}
