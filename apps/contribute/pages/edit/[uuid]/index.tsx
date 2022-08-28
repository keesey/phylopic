import { isPublicDomainLicenseURL, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import SourceClient from "~/source/SourceClient"
const Editor = dynamic(() => import("~/screens/Editor"))
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Image",
            url: `https://${process.env.NEXT_PUBLIC_CONTRIBUTE_DOMAIN}/edit/${encodeURIComponent(uuid)}`,
        }}
        imageUUID={uuid}
    >
        <AuthorizedOnly>
            <Editor uuid={uuid} />
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
    let redirect: "file" | "usage" | "nodes" | undefined
    let notFound = false
    try {
        client = new SourceClient()
        const imageClient = client.image(uuid)
        if (!(await imageClient.exists())) {
            notFound = true
        } else if (!(await imageClient.file.exists())) {
            redirect = "file"
        } else {
            const image = await imageClient.get()
            if (!image.specific) {
                redirect = "nodes"
            } else if (!image.license || (!isPublicDomainLicenseURL(image.license) && !image.attribution)) {
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
                destination: `/edit/${encodeURIComponent(uuid)}/${encodeURIComponent(redirect)}`,
                permanent: false,
            },
        }
    }
    return { props: { uuid } }
}
