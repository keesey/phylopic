import { DATA_MEDIA_TYPE, Link } from "@phylopic/api-models"
import { EMPTY_UUID, isUUIDv4, stringifyNormalized, UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import checkContentType from "../mediaTypes/checkContentType"
import { PgClientService } from "../services/PgClientService"
import { Operation } from "./Operation"
const ACCEPT = `application/json,${DATA_MEDIA_TYPE}`
const MAX_BODY_SIZE = 24576
const EMPTY_DIGITS: readonly number[] = new Array(32).fill(0)
const USER_MESSAGE = "There was a problem with an attempt to find a collection."
export type PostCollectionParameters = DataRequestHeaders & {
    "content-type"?: string
}
export type PostCollectionService = PgClientService
const getUUIDsFromBody = (body: string): ReadonlySet<UUID> => {
    try {
        const data = JSON.parse(body)
        if (!Array.isArray(data)) {
            throw new Error("Not an array.")
        }
        const invalid = data.find(item => !isUUIDv4(item))
        if (invalid) {
            throw new Error(`Not a valid UUIDv4: ${JSON.stringify(invalid)}.`)
        }
        return new Set<UUID>(data)
    } catch (e) {
        throw new APIError(400, [
            {
                developerMessage: `Invalid body. ${String(e)}`,
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
}
const uuidToDigits = (uuid: string) => {
    return uuid
        .split("")
        .filter(c => c !== "-")
        .map(c => parseInt(c, 16))
}
const digitsToUUID = (digits: readonly number[]): string => {
    const s = digits.map(digit => digit.toString(16)).join("")
    return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20, 32)}`
}
const xorDigits = (a: readonly number[], b: readonly number[]): readonly number[] => {
    return a.map((digit, index) => digit ^ b[index])
}
const getCollectionUUID = (uuids: ReadonlySet<string>): string => {
    if (uuids.size === 0) {
        return EMPTY_UUID
    }
    if (uuids.size === 1) {
        return [...uuids][0]
    }
    const digits = [...uuids].map(uuidToDigits).reduce<readonly number[]>(xorDigits, EMPTY_DIGITS)
    return digitsToUUID(digits)
}
const ensureExistence = async (service: PgClientService, uuid: string, uuids: ReadonlySet<string>) => {
    if (uuids.size > 0) {
        const client = await service.createPgClient()
        try {
            const result = await client.query<{ uuid: UUID }>(
                "SELECT uuid FROM collection WHERE uuid=$1::uuid LIMIT 1",
                [uuid],
            )
            if (!result.rowCount) {
                await client.query("INSERT INTO collection (uuid, uuids) VALUES ($1::uuid, $2::uuid[])", [uuid, [...uuids].sort()])
            }
        } finally {
            await service.deletePgClient(client)
        }
    }
}
export const postCollection: Operation<PostCollectionParameters, PostCollectionService> = async (
    { accept, body, "content-type": contentType },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkContentType(contentType, ACCEPT)
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
    if (body.length > MAX_BODY_SIZE) {
        throw new APIError(413, [
            {
                developerMessage: "Payload too large.",
                field: "body",
                type: "REQUEST_TOO_LARGE",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    const uuids = getUUIDsFromBody(body)
    const uuid = getCollectionUUID(uuids)
    await ensureExistence(service, uuid, uuids)
    const link: Link = { href: `/collections/${encodeURIComponent(uuid)}` }
    return {
        body: stringifyNormalized(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, true),
            "access-control-allow-methods": "OPTIONS,POST",
        },
        statusCode: 308,
    } as APIGatewayProxyResult
}
export default postCollection
