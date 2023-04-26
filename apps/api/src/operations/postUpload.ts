import { GetObjectTaggingCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { DATA_MEDIA_TYPE, Image, isImage, Link } from "@phylopic/api-models"
import { Submission } from "@phylopic/source-models"
import {
    createQueryString,
    ImageMediaType,
    isImageMediaType,
    isUUIDv4,
    stringifyNormalized,
    UUID,
} from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import { createHash } from "crypto"
import decodeJWT from "../auth/jwt/decodeJWT"
import parseEntityJSON from "../entities/parseEntityJSON"
import selectEntityJSON from "../entities/selectEntityJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import checkContentType from "../mediaTypes/checkContentType"
import { PgClientService } from "../services/PgClientService"
import { S3ClientService } from "../services/S3ClientService"
import { Operation } from "./Operation"
const Bucket = "uploads.phylopic.org"
const USER_MESSAGE = "There was a problem with an attempt to upload your file."
const USER_AUTH_MESSAGE =
    "There was a problem with an attempt to upload your file. You may need to sign out and sign back in."
export type PostUploadParameters = DataRequestHeaders & {
    authorization?: string
    "content-type"?: string
    encoding: "base64" | "utf8"
    existing_uuid?: UUID
}
export type PostUploadService = PgClientService & S3ClientService
const ACCEPT = "image/svg+xml,image/png,image/gif,image/bmp,image/jpeg"
export const postUpload: Operation<PostUploadParameters, PostUploadService> = async (
    { accept, authorization, body, "content-type": contentType, encoding, existing_uuid },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkContentType(contentType, ACCEPT)
    if (!isImageMediaType(contentType)) {
        throw new Error("Unexpected condition.") // This should never happen.
    }
    if (!body) {
        throw createMissingBodyError()
    }
    const contributor = getContributor(authorization)
    const image = existing_uuid ? await getReplacementImage(existing_uuid, contributor, service) : undefined
    const hash = getHash(body)
    const key = `files/${encodeURIComponent(hash)}`
    await uploadBody(service, key, contributor, Buffer.from(body, encoding), contentType, image)
    const link: Link = { href: "https://uploads.phylopic.org/" + encodeURIComponent(key) }
    return {
        body: stringifyNormalized(link),
        headers: DATA_HEADERS,
        statusCode: 200,
    } as APIGatewayProxyResult
}
export default postUpload
const getHash = (body: string) => {
    const hashSum = createHash("sha256")
    hashSum.update(body)
    return hashSum.digest("hex")
}
const createMissingBodyError = () =>
    new APIError(400, [
        {
            developerMessage: "Missing body.",
            field: "body",
            type: "BAD_REQUEST_BODY",
            userMessage: USER_MESSAGE,
        },
    ])
const createInvalidReplaceUUIDError = () =>
    new APIError(400, [
        {
            developerMessage: "Invalid replacement UUID.",
            field: "existing_uuid",
            type: "BAD_REQUEST_PARAMETERS",
            userMessage: USER_MESSAGE,
        },
    ])
const createForbiddenReplacementError = () =>
    new APIError(403, [
        {
            developerMessage: "The user is not the contributor for this image.",
            field: "existing_uuid",
            type: "ACCESS_DENIED",
            userMessage: USER_MESSAGE,
        },
    ])
const createUUIDError = (falseUUID: unknown) =>
    new APIError(401, [
        {
            developerMessage: "Invalid authorization. Expected a UUID: " + String(falseUUID),
            field: "authorization",
            type: "UNAUTHORIZED",
            userMessage: USER_AUTH_MESSAGE,
        },
    ])
const createExistingError = (isSameUser: boolean) =>
    new APIError(409, [
        {
            developerMessage: `Upload already exists${isSameUser ? "" : " and is attributed to another contributor"}."`,
            field: "body",
            type: "DEFAULT_4XX",
            userMessage: `${isSameUser ? "You" : "Somebody else"} already uploaded that file.`,
        },
    ])
const getCurrentStatus = async (
    client: S3Client,
    Key: string,
): Promise<{ uploaded: false } | { contributor: UUID; uploaded: true }> => {
    let contributor: string | undefined
    try {
        const response = await client.send(
            new GetObjectTaggingCommand({
                Bucket,
                Key,
            }),
        )
        contributor = response.TagSet?.find(tag => tag.Key === "contributor")?.Value
    } catch (e) {
        if ((e as any)?.$metadata?.httpStatusCode === 404) {
            return { uploaded: false }
        }
        throw e
    }
    return contributor ? { contributor, uploaded: true } : { uploaded: false }
}
const getReplacementImage = async (uuid: UUID, contributorUUID: UUID, service: PgClientService): Promise<Image> => {
    let image: Image
    if (!isUUIDv4(uuid)) {
        throw createInvalidReplaceUUIDError()
    }
    const client = await service.createPgClient()
    try {
        const imageJSON = await selectEntityJSON(client, "image", uuid, "Could not find the specified image.")
        image = parseEntityJSON(imageJSON, isImage)
        if (image._links.contributor.href !== `/contributors/${contributorUUID}`) {
            throw createForbiddenReplacementError()
        }
    } finally {
        service.deletePgClient(client)
    }
    return image
}
const upload = async (
    client: S3Client,
    Body: Buffer,
    ContentType: ImageMediaType,
    Key: string,
    contributor: UUID,
    image?: Image,
) => {
    await client.send(
        new PutObjectCommand({
            ACL: "public-read",
            Body,
            Bucket,
            ContentType,
            Key,
            Tagging: createQueryString({
                attribution: image?.attribution,
                contributor,
                created: image ? image.created : new Date().toISOString(),
                existingUUID: image?.uuid,
                license: image?._links.license.href,
                sponsor: image?.sponsor,
                status: "incomplete",
            } as Partial<Submission> & Record<string, string>),
        }),
    )
}
const uploadBody = async (
    service: S3ClientService,
    key: string,
    contributor: UUID,
    body: Buffer,
    contentType: ImageMediaType,
    image?: Image,
) => {
    const client = service.createS3Client()
    try {
        const status = await getCurrentStatus(client, key)
        if (status.uploaded) {
            throw createExistingError(status.contributor === contributor)
        } else {
            await upload(client, body, contentType, key, contributor, image)
        }
    } finally {
        service.deleteS3Client(client)
    }
}
const getContributor = (authorization: string | undefined): UUID => {
    const payload = authorization ? decodeJWT(authorization.replace(/^Bearer\s+/, "")) : null
    const contributor = payload?.sub
    if (!isUUIDv4(contributor)) {
        throw createUUIDError(contributor)
    }
    return contributor
}
