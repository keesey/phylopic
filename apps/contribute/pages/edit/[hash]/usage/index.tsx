import { Hash, isHash } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Usage = dynamic(() => import("~/screens/Usage"))
type Props = {
    hash: Hash
}
const Page: NextPage<Props> = ({ hash }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Usage of Your Submission",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(hash)}/usage`,
        }}
        submissionHash={hash}
    >
        <AuthorizedOnly>
            <Usage hash={hash} />
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