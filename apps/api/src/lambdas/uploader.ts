import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import APIError from "../errors/APIError"
import create405 from "../errors/create405"
import errorToResult from "../errors/errorToResult"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import TEMPORARY_HEADERS from "../headers/responses/TEMPORARY_HEADERS"
import postUpload from "../operations/postUpload"
import { S3ClientService } from "../services/S3ClientService"
import getParameters from "./parameters/getParameters"
import S3_CLIENT_SERVICE from "./services/S3_CLIENT_SERVICE"
const SERVICE: S3ClientService = S3_CLIENT_SERVICE
const route: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> = (event: APIGatewayProxyEvent) => {
    const { path } = event
    switch (path) {
        case "/uploads": {
            switch (event.httpMethod) {
                case "POST": {
                    return postUpload(
                        {
                            body: event.body ?? undefined,
                            ...getParameters(event.headers, ["accept", "authorization", "content-type"]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
        default: {
            throw new APIError(
                404,
                [
                    {
                        developerMessage: `Invalid path: "${path}".`,
                        type: "RESOURCE_NOT_FOUND",
                        userMessage: "An invalid request was made.",
                    },
                ],
                TEMPORARY_HEADERS,
            )
        }
    }
}
export const onAPIGatewayProxy: APIGatewayProxyHandler = async (event, _context) => {
    let result: APIGatewayProxyResult
    try {
        result = await route(event)
    } catch (e) {
        result = errorToResult(e)
    }
    return {
        ...result,
        headers: {
            ...CORS_HEADERS,
            ...result.headers,
        },
    }
}
