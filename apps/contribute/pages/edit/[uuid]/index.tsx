import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import getSubmissionFileKeyPrefix from "~/s3/keys/contribute/getSubmissionFileKeyPrefix"
import getImageFileKeyPrefix from "~/s3/keys/source/getImageFileKeyPrefix"
import Editor from "~/screens/Editor"
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Image",
            url: `https://contribute.phylopic.org/edit/${encodeURIComponent(uuid)}`,
        }}
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
    const client = new S3Client({})
    let hasFile = false
    try {
        const [sourceFileOutput, submissionFileOutput] = await Promise.all([
            client.send(
                new ListObjectsV2Command({
                    Bucket: SOURCE_BUCKET_NAME,
                    MaxKeys: 1,
                    Prefix: getImageFileKeyPrefix(uuid),
                }),
            ),
            client.send(
                new ListObjectsV2Command({
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    MaxKeys: 1,
                    Prefix: getSubmissionFileKeyPrefix(uuid),
                }),
            ),
        ])
        hasFile = sourceFileOutput.Contents?.length === 1 || submissionFileOutput.Contents?.length === 1
    } finally {
        client.destroy()
    }
    if (!hasFile) {
        return { redirect: { destination: `/edit/${encodeURIComponent(uuid)}/file`, permanent: false } }
    }
    return { props: { uuid } }
}
