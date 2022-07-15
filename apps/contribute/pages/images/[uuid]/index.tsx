import { HeadObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { CONTRIBUTE_BUCKET_NAME } from "@phylopic/source-models"
import { isEmailAddress, isUUIDv4, UUID } from "@phylopic/utils"
import type { GetServerSideProps, NextPage } from "next"
import AuthorizedOnly from "~/auth/AuthorizedOnly"
import getBearerJWT from "~/auth/http/getBearerJWT"
import verifyJWT from "~/auth/jwt/verifyJWT"
import PageLayout from "~/pages/PageLayout"
import getSubmissionKey from "~/s3/keys/getSubmissionKey"
type Props = {
    error?: true
    uuid: UUID
}
const Page: NextPage<Props> = ({ error, uuid }) => (
    <PageLayout
        head={{
            title: "PhyloPic: Your Image",
            url: `https://contribute.phylopic.org/submissions/${encodeURIComponent(uuid)}`,
        }}
    >
        <AuthorizedOnly>
            <p>:TODO:</p>
        </AuthorizedOnly>
    </PageLayout>
)
export default Page
export const getServerSideProps: GetServerSideProps<Props> = async context => {
    const uuid = context.params?.uuid
    if (!isUUIDv4(uuid)) {
        return { notFound: true }
    }
    let client: S3Client | undefined
    try {
        if (!context.req.headers.authorization) {
            throw 401
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
        const result = await client.send(
            new HeadObjectCommand({
                Bucket: CONTRIBUTE_BUCKET_NAME,
                Key: getSubmissionKey(email, uuid),
            }),
        )
        if (result.$metadata.httpStatusCode !== 200) {
            throw result.$metadata.httpStatusCode ?? 500
        }
    } catch (e) {
        if (typeof e === "number") {
            context.res.statusCode = e
        }
        return {
            props: { uuid, error: true },
        }
    } finally {
        client?.destroy()
    }
    return {
        props: { uuid },
    }
}
