import { HeadObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME, SUBMISSIONS_BUCKET_NAME } from "@phylopic/source-models"
import { isUUID, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import getBearerJWT from "~/auth/http/getBearerJWT"
import verifyAuthorization from "~/auth/http/verifyAuthorization"
import PageLayout from "~/pages/PageLayout"
import getImageFileKeyPrefix from "~/s3/keys/source/getImageFileKeyPrefix"
import getSubmissionSourceKey from "~/s3/keys/submissions/getSubmissionSourceKey"
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
    const token = getBearerJWT(context.req.headers.authorization)
    const uuid = context.params?.uuid
    if (!token || !isUUIDv4(uuid)) {
        return { notFound: true }
    }
    let contributorUUID: UUID
    try {
        const payload = await verifyAuthorization(context.req.headers)
        contributorUUID = payload.uuid
    } catch {
        return { notFound: true }
    }
    if (!isUUID(contributorUUID)) {
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
                new HeadObjectCommand({
                    Bucket: SUBMISSIONS_BUCKET_NAME,
                    Key: getSubmissionSourceKey(contributorUUID, uuid),
                }),
            ),
        ])
        hasFile = sourceFileOutput.Contents?.length === 1 || submissionFileOutput.$metadata.httpStatusCode === 200
    } finally {
        client.destroy()
    }
    if (!hasFile) {
        return { redirect: { destination: `/edit/${encodeURIComponent(uuid)}/file`, permanent: false } }
    }
    return { props: { uuid } }
}
