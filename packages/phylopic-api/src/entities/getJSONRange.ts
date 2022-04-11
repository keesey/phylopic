import { S3Client } from "@aws-sdk/client-s3"
import { APIGatewayProxyResult } from "aws-lambda"
import { EntityType } from "../entities/EntityType"
import APIError from "../errors/APIError"
import createRangeResult from "../lists/createRangeResult"
import isAWSError from "../utils/aws/isAWSError"
import getEntityJSON from "./get"
const getUserMessage = (label: string) => `The request for ${label} data is improperly formed.`
const getJSONRange: (params: {
    embed?: string
    href: string
    length: number
    s3Client: S3Client
    start: number
    total: number
    type: EntityType
    uuids: readonly string[]
}) => Promise<APIGatewayProxyResult> = async ({ embed, href, length, s3Client, start, total, type, uuids }) => {
    if (!uuids.length && start > 0) {
        throw new APIError(404, [
            {
                developerMessage: "No items in range.",
                field: "start",
                type: "RESOURCE_NOT_FOUND",
                userMessage: getUserMessage(type.userLabel),
            },
        ])
    }
    const entityPromises = uuids.map(async uuid => {
        let data = "null"
        try {
            data = await getEntityJSON(s3Client, embed, uuid, type)
        } catch (e) {
            if (isAWSError(e) && e.$metadata.httpStatusCode === 404) {
                data = "null"
            } else {
                throw e
            }
        }
        return data
    })
    const items = await Promise.all(entityPromises)
    return createRangeResult({
        href,
        items,
        length,
        start,
        total,
    })
}
export default getJSONRange
