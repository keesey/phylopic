import { PutObjectCommand } from "@aws-sdk/client-s3"
import { DATA_MEDIA_TYPE, Link } from "@phylopic/api-models"
import { Submission } from "@phylopic/source-models"
import { createQueryString, isUUIDv4, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import { createHash } from "crypto"
import { JwtPayload } from "jsonwebtoken"
import isExpired from "../auth/jwt/isExpired"
import verifyJWT from "../auth/jwt/verifyJWT"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import checkContentType from "../mediaTypes/checkContentType"
import { S3ClientService } from "../services/S3ClientService"
import { Operation } from "./Operation"
const USER_MESSAGE = "There was a problem with an attempt to upload your file."
export type PostUploadParameters = DataRequestHeaders & {
    authorization?: string
    "content-type"?: string
}
export type PostUploadService = S3ClientService
const ACCEPT = "image/svg+xml,image/png,image/gif,image/bmp,image/jpeg"
const checkAuthorization = async (authorization: string | undefined, now: Date) => {
    let payload: JwtPayload | null = null
    if (authorization?.match(/^Bearer\s+/)) {
        const jwt = authorization.replace(/^Bearer\s+/, "")
        try {
            payload = await verifyJWT(jwt)
            if (isExpired(payload?.exp, now.valueOf())) {
                throw new APIError(
                    401,
                    [
                        {
                            developerMessage: "Your authorization has expired.",
                            field: "authorization",
                            type: "UNAUTHORIZED",
                            userMessage: USER_MESSAGE,
                        },
                    ],
                    {
                        "www-authenticate":
                            'Bearer realm="phylopic.org",error="invalid token",error_description="The access token expired."',
                    },
                )
            }
        } catch (e) {
            console.error(e)
            throw new APIError(
                401,
                [
                    {
                        developerMessage: "Invalid authorization: " + e,
                        field: "authorization",
                        type: "UNAUTHORIZED",
                        userMessage: USER_MESSAGE,
                    },
                ],
                {
                    "www-authenticate": 'Bearer realm="phylopic.org",error="invalid token"',
                },
            )
        }
    }
    if (!payload) {
        throw new APIError(
            401,
            [
                {
                    developerMessage: "Not authorized.",
                    field: "authorization",
                    type: "UNAUTHORIZED",
                    userMessage: USER_MESSAGE,
                },
            ],
            {
                "www-authenticate": 'Bearer realm="phylopic.org",error="missing token"',
            },
        )
    }
    return payload
}
const checkContributorUUID = (sub: unknown): UUID => {
    if (!isUUIDv4(sub)) {
        throw new APIError(
            401,
            [
                {
                    developerMessage: "Invalid authorization subject.",
                    field: "authorization",
                    type: "UNAUTHORIZED",
                    userMessage: USER_MESSAGE,
                },
            ],
            {
                "www-authenticate":
                    'Bearer realm="phylopic.org",error="invalid token",error_description="Invalid token subject."',
            },
        )
    }
    return sub
}
const getHash = (body: string) => {
    const hashSum = createHash("sha256")
    hashSum.update(body)
    return hashSum.digest("hex")
}
export const postUpload: Operation<PostUploadParameters, PostUploadService> = async (
    { accept, authorization, body, "content-type": contentType },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkContentType(contentType, ACCEPT)
    const payload = await checkAuthorization(authorization, new Date())
    const contributorUUID = checkContributorUUID(payload.sub)
    if (!body) {
        throw new APIError(400, [
            {
                developerMessage: "Missing body.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    const hash = getHash(body)
    const client = service.createS3Client()
    try {
        const now = new Date().toISOString()
        await client.send(
            new PutObjectCommand({
                Bucket: "uploads.phylopic.org",
                Body: body,
                ContentType: contentType,
                Key: `files/${encodeURIComponent(hash)}`,
                Tagging: createQueryString({
                    contributor: contributorUUID,
                    created: new Date().toISOString(),
                    status: "incomplete"
                } as Submission),
            }),
        )
    } finally {
        service.deleteS3Client(client)
    }
    const link: Link = {
        href: `https://uploads.phylopic.org/files/${encodeURIComponent(hash)}`,
    }
    return {
        body: stringifyNormalized(link),
        headers: DATA_HEADERS,
        statusCode: 200,
    } as APIGatewayProxyResult
}
export default postUpload
