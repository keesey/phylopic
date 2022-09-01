import { Hash, isHash, isPublicDomainLicenseURL } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Editor = dynamic(() => import("~/screens/Editor"))
type Props = {
    hash: Hash
}
const Page: NextPage<Props> = ({ hash }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Submission",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(hash)}`,
        }}
        submissionHash={hash}
    >
        <AuthorizedOnly>
            <Editor hash={hash} />
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
    let redirect: "nodes" | "usage" | undefined
    let notFound = false
    try {
        client = new SourceClient()
        const submissionClient = client.submission(hash)
        if (!(await submissionClient.exists())) {
            notFound = true
        } else {
            const submission = await submissionClient.get()
            if (!submission.identifier) {
                redirect = "nodes"
            } else if (
                !submission.license ||
                (!isPublicDomainLicenseURL(submission.license) && !submission.attribution)
            ) {
                redirect = "usage"
            }
        }
    } finally {
        client?.destroy()
    }
    if (notFound) {
        return { notFound }
    }
    if (redirect) {
        return {
            redirect: {
                destination: `/edit/${encodeURIComponent(hash)}/${encodeURIComponent(redirect)}`,
                permanent: false,
            },
        }
    }
    return { props: { hash } }
}
