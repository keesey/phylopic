import { S3Client, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import PageLayout from "~/pages/PageLayout"
import Editor from "~/screens/Editor"
import Images from "~/screens/Images"
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
        const [sourceOutput, submissionOutput] = await Promise.all([
            client.send(
                new ListObjectsV2Command({
                    Bucket: SOURCE_BUCKET_NAME,
                    MaxKeys: 1,
                    Prefix: `images/${encodeURIComponent(uuid)}/source.`,
                }),
            ),
            client.send(
                new ListObjectsV2Command({
                    Bucket: CONTRIBUTE_BUCKET_NAME,
                    MaxKeys: 1,
                    Prefix: `submissionfiles/${encodeURIComponent(uuid)}/source.`,
                }),
            ),
        ])
        hasFile = sourceOutput.Contents?.length === 1 || submissionOutput.Contents?.length === 1
    } finally {
        client.destroy()
    }
    if (!hasFile) {
        return { redirect: { destination: `/edit/${encodeURIComponent(uuid)}/file`, permanent: false } }
    }
    return { props: { uuid } }
}
