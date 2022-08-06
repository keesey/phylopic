import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import dynamic from "next/dynamic"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
const Usage = dynamic(() => import("~/screens/Usage"))
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
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
    return { props: { uuid } }
}