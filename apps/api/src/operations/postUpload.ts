import { S3Client, GetObjectTaggingCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { DATA_MEDIA_TYPE, Link } from "@phylopic/api-models"
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
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import checkContentType from "../mediaTypes/checkContentType"
import { S3ClientService } from "../services/S3ClientService"
import { Operation } from "./Operation"
const Bucket = "uploads.phylopic.org"
const USER_MESSAGE = "There was a problem with an attempt to upload your file."
const USER_AUTH_MESSAGE =
    "There was a problem with an attempt to upload your file. You may need to sign out and sign back in."
export type PostUploadParameters = DataRequestHeaders & {
    authorization?: string
    "content-type"?: string
}
export type PostUploadService = S3ClientService
const ACCEPT = "image/svg+xml,image/png,image/gif,image/bmp,image/jpeg"
export const postUpload: Operation<PostUploadParameters, PostUploadService> = async (
    { accept, authorization, body, "content-type": contentType },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkContentType(contentType, ACCEPT)
    if (!isImageMediaType(contentType)) {
        throw new Error("Unexpected condition.")
    }
    if (!body) {
        throw createMissingBodyError()
    }
    const contributor = getContributor(authorization)
    const hash = getHash(body)
    const key = `files/${encodeURIComponent(hash)}`
    await uploadBody(service, key, contributor, body, contentType)
    const link: Link = {
        href: "https://uploads.phylopic.org/" + key,
    }
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
const createUUIDError = (falseUUID: unknown) =>
    new APIError(401, [
        {
            developerMessage: "Invalid authorization. Expected a UUID: " + String(falseUUID),
            field: "authorization",
            type: "UNAUTHORIZED",
            userMessage: USER_AUTH_MESSAGE,
        },
    ])
const createExistingError = () =>
    new APIError(403, [
        {
            developerMessage: "Upload already exists and is attributed to another contributor.",
            field: "authorization",
            type: "ACCESS_DENIED",
            userMessage: "Somebody else already uploaded that file.",
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
const upload = async (client: S3Client, Body: string, ContentType: ImageMediaType, Key: string, contributor: UUID) => {
    await client.send(
        new PutObjectCommand({
            ACL: "public-read",
            Body,
            Bucket,
            ContentType,
            Key,
            Tagging: createQueryString({
                contributor,
                created: new Date().toISOString(),
                status: "incomplete",
            } as Submission),
        }),
    )
}
const uploadBody = async (
    service: S3ClientService,
    key: string,
    contributor: UUID,
    body: string,
    contentType: ImageMediaType,
) => {
    const client = service.createS3Client()
    try {
        const status = await getCurrentStatus(client, key)
        if (status.uploaded) {
            if (status.contributor !== contributor) {
                throw createExistingError()
            }
            console.warn("User already uploaded this file.")
        } else {
            await upload(client, body, contentType, key, contributor)
        }
    } finally {
        service.deleteS3Client(client)
    }
}
const getContributor = (authorization: string | undefined) => {
    const payload = authorization ? decodeJWT(authorization.replace(/^Bearer\s+/, "")) : null
    const contributor = payload?.sub
    if (!isUUIDv4(contributor)) {
        throw createUUIDError(contributor)
    }
    return contributor
}
