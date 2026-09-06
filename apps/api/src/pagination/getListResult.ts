import { UUID } from "@phylopic/utils"
import { APIGatewayProxyResult } from "aws-lambda"
import getS3EntityJSON from "../entities/getS3EntityJSON"
import APIError from "../errors/APIError"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import type { S3ClientService } from "../services/S3ClientService"
import withS3Client from "../services/withS3Client"
import getPageIndex from "./getPageIndex"
import type { S3ListSource } from "./S3ListSource"

export type ListPageRow = Readonly<{
    json: string
    title: string | null
    uuid: UUID
}>

interface Parameters<TEmbedded = Record<string, never>> {
    listPath: string
    listQuery: Readonly<Record<string, string | number | boolean | undefined>>
    page?: string
    service: S3ClientService
    s3List: S3ListSource
    userMessage?: string
    validEmbeds: ReadonlyArray<string & keyof TEmbedded>
}

const OK_RESULT: Pick<APIGatewayProxyResult, "headers" | "statusCode"> = {
    headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
    statusCode: 200,
}

const createListNotFound = (userMessage: string, developerMessage: string, field?: string) =>
    new APIError(
        404,
        [
            {
                developerMessage,
                field,
                type: "RESOURCE_NOT_FOUND",
                userMessage,
            },
        ],
        PERMANENT_HEADERS,
    )

const getListResult = async <TEmbedded = Record<string, never>>({
    page,
    s3List,
    service,
    userMessage = "There was an error in a request for data.",
}: Parameters<TEmbedded>) =>
    withS3Client(service, async client => {
        if (!page) {
            const body = await getS3EntityJSON(client, s3List.getIndexKey())
            if (body === null) {
                throw createListNotFound(userMessage, "List index JSON is missing.", "page")
            }
            return {
                ...OK_RESULT,
                body,
            }
        }
        const pageIndex = getPageIndex(page)
        const body = await getS3EntityJSON(client, s3List.getPageKey(pageIndex))
        if (body === null) {
            throw createListNotFound(userMessage, "List page JSON is missing.", "page")
        }
        return {
            ...OK_RESULT,
            body,
        }
    })

export default getListResult
