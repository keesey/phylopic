import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Contributor, isContributor, SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import {
    EmailAddress,
    isEmailAddress,
    isUUID,
    isUUIDv4,
    stringifyNormalized,
    UUID,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { getJSON, isAWSError } from "@phylopic/utils-aws"
import { NextApiHandler } from "next"
import decodeJWT from "~/auth/jwt/decodeJWT"
import { JWT } from "~/auth/models/JWT"
import getToken from "~/auth/s3/getToken"
import handleAPIError from "~/errors/handleAPIError"
import getContributorSourceKey from "~/s3/keys/source/getContributorSourceKey"
const getExistingContributor = async (client: S3Client, uuid: UUID) => {
    try {
        const [contributor] = await getJSON(
            client,
            {
                Bucket: SOURCE_BUCKET_NAME,
                Key: getContributorSourceKey(uuid),
            },
            isContributor,
        )
        return contributor
    } catch (e) {
        if (isAWSError(e) && e.$metadata.httpStatusCode >= 400 && e.$metadata.httpStatusCode < 500) {
            return null
        }
        throw e
    }
}
const updateContributor = async (client: S3Client, uuid: UUID, emailAddress: EmailAddress) => {
    const existing = await getExistingContributor(client, uuid)
    if (existing?.emailAddress === emailAddress) {
        return null
    }
    await client.send(
        new PutObjectCommand({
            Body: stringifyNormalized({
                created: new Date().toISOString(),
                name: "Anonymous",
                showEmailAddress: true,
                ...existing,
                emailAddress,
            } as Contributor),
            Bucket: SOURCE_BUCKET_NAME,
            ContentType: "application/json",
            Key: getContributorSourceKey(uuid),
        }),
    )
}
const index: NextApiHandler<string | null> = async (req, res) => {
    const now = new Date()
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("allow", "GET, OPTIONS")
            res.setHeader("cache-control", "max-age=3600")
            res.setHeader("date", now.toUTCString())
            res.status(204)
        } else if (req.method !== "GET") {
            throw 405
        } else {
            const email = req.query.email as EmailAddress
            const jti = req.query.jti as UUID
            const faultCollector = new ValidationFaultCollector()
            if (!isEmailAddress(email, faultCollector.sub("email")) || !isUUIDv4(jti, faultCollector.sub("jti"))) {
                console.warn(faultCollector.list())
                throw 404
            }
            const client = new S3Client({})
            let token: JWT | null
            let expires: Date | null
            try {
                ;[token, expires] = await getToken(client, email)
                if (!token || !expires) {
                    throw 404
                }
                if (expires.valueOf() <= now.valueOf()) {
                    throw 410
                }
                const payload = decodeJWT(token)
                if (payload?.jti !== jti || !isUUIDv4(payload.sub)) {
                    throw 404
                }
                await updateContributor(client, payload.sub, email)
            } finally {
                client.destroy()
            }
            res.setHeader("expires", expires.toString())
            res.setHeader("content-type", "application/jwt")
            res.status(200)
            res.send(token)
        }
    } catch (e) {
        handleAPIError(res, e)
    }
    res.end()
}
export default index
