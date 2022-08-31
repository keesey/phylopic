import { API } from "@phylopic/api-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import fetchJSON from "~/fetch/fetchJSON"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Assignment = dynamic(() => import("~/screens/Assignment"))
type Props = {
    build: number
    uuid: UUID
}
const Page: NextPage<Props> = ({ build, uuid }) => (
    <PageLayout
        build={build}
        head={{
            title: "PhyloPic: Your Image's Taxonomic Assignment",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(uuid)}/nodes`,
        }}
        imageUUID={uuid}
    >
        <AuthorizedOnly>
            <Assignment uuid={uuid} />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
    const buildPromise = fetchJSON<API>("https://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/")
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    let client: SourceClient | undefined
    let notFound = false
    try {
        client = new SourceClient()
        const submissionClient = client.submission(uuid)
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
            uuid,
        },
    }
}
