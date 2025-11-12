import { API } from "@phylopic/api-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash, isHash } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import { Suspense } from "react"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import LoadingState from "~/screens/LoadingState"
import SourceClient from "~/source/SourceClient"
const Tags = dynamic(() => import("~/screens/Tags"), { ssr: false })
type Props = {
    build: number
    hash: Hash
}
const Page: NextPage<Props> = ({ build, hash }) => (
    <PageLayout
        build={build}
        seo={{
            noindex: true,
            title: "PhyloPic: Tagging Your Submission",
        }}
        submissionHash={hash}
    >
        <AuthorizedOnly>
            <Suspense fallback={<LoadingState>One moment…</LoadingState>}>
                <Tags hash={hash} />
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
    const buildPromise = fetchJSON<API>(process.env.NEXT_PUBLIC_API_URL + "/")
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
        props: {
            build: (await buildPromise).build,
            hash,
        },
    }
}
