import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { isEmailAddress, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import getBearerJWT from "~/auth/http/getBearerJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import PageLayout from "~/pages/PageLayout"
import checkMetadataBearer from "~/s3/api/checkMetadataBearer"
import getSubmissionKey from "~/s3/keys/contribute/getSubmissionKey"
type Props = {
    uuid: UUID
}
const Page: NextPage<Props> = ({ uuid }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Submission",
            url: `https://contribute.phylopic.org/submissions/${encodeURIComponent(uuid)}`,
        }}
    >
        <AuthorizedOnly>:TODO:</AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
    let client: S3Client | undefined
    try {
        if (!isUUIDv4(uuid)) {
            throw 404
        }
        if (!context.req.headers.authorization) {
            return {
                redirect: { destination: "/", permanent: false },
            }
        }
        const token = getBearerJWT(context.req.headers.authorization)
        const payload = await verifyJWT(token)
        if (!payload) {
            throw 403
        }
        const email = payload.sub
        if (!isEmailAddress(email)) {
            throw 403
        }
        client = new S3Client({})
        const output = await client.send(
            new HeadObjectCommand({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                Key: getSubmissionKey(email, uuid),
            }),
        )
        checkMetadataBearer(output)
    } catch (e) {
        console.error(e)
        client?.destroy()
        client = undefined
        if (typeof e === "number") {
            switch (e) {
                case 401:
                case 403: {
                    return {
                        redirect: { destination: "/", permanent: false },
                    }
                }
                case 404:
                case 410: {
                    return { notFound: true }
                }
                default: {
                    throw e
                }
            }
        } else {
            throw e
        }
    } finally {
        client?.destroy()
    }
    return {
        props: { uuid },
    }
}
