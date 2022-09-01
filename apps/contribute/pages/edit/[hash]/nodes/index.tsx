import { API } from "@phylopic/api-models"
import { Hash, isHash, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import fetchJSON from "~/fetch/fetchJSON"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Assignment = dynamic(() => import("~/screens/Assignment"))
type Props = {
    build: number
    hash: Hash
}
const Page: NextPage<Props> = ({ build, hash }) => (
    <PageLayout
        build={build}
        head={{
            title: "PhyloPic: Your Submission’s Taxonomic Assignment",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(hash)}/nodes`,
        }}
        submissionHash={hash}
    >
        <AuthorizedOnly>
            <Assignment hash={hash} />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const hash = context.params?.hash
    if (!isHash(hash)) {
        return { notFound: true }
    }
    const buildPromise = fetchJSON<API>("https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/")
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
