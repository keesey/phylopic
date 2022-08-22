import { AnchorLink } from "@phylopic/ui"
import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Usage = dynamic(() => import("~/screens/Usage"))
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
        breadcrumbs={[
            <AnchorLink href={`/edit/${encodeURIComponent(uuid)}`}>
                <span>Your Image</span>
            </AnchorLink>,
            <a>
                <span>Usage</span>
            </a>,
        ]}
        head={{
            title: "PhyloPic: Usage of Your Image",
            url: `https://contribute.phylopic.org/edit/${encodeURIComponent(uuid)}/usage`,
        }}
    >
        <AuthorizedOnly>
            <Usage uuid={uuid} />
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
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
    return { props: { uuid } }
}
