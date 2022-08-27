import { API } from "@phylopic/api-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
import fetchJSON from "~/swr/fetchJSON"
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
            url: `https://contribute.phylopic.org/edit/${encodeURIComponent(uuid)}/nodes`,
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
    const buildPromise = fetchJSON<API>(process.env.NEXT_PUBLIC_API_URL + "/")
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    let client: SourceClient | undefined
    let redirectToFile = false
    let notFound = false
    try {
        client = new SourceClient()
        const imageClient = client.image(uuid)
        if (!(await imageClient.exists())) {
            notFound = true
        } else if (!(await imageClient.file.exists())) {
            redirectToFile = true
        }
    } finally {
        client?.destroy()
    }
    if (notFound) {
        return { notFound }
    }
    if (redirectToFile) {
        return {
            redirect: {
                destination: `/edit/${encodeURIComponent(uuid)}/file`,
                permanent: false,
            },
        }
    }
    return { props: {
        build: (await buildPromise).build,
        uuid,
    } }
}
