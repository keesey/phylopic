import { UUID } from "@phylopic/utils"
import type { NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Uploader from "~/screens/Uploader"
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => {
    return (
        <PageLayout
            head={{
                title: "PhyloPic: Upload Image",
                url: `https://contribute.phylopic.org/edit/${encodeURIComponent(uuid)}/file`,
            }}
        >
            <AuthorizedOnly>
                <Uploader uuid={uuid} />
            </AuthorizedOnly>
        </PageLayout>
    )
}
export default Page
