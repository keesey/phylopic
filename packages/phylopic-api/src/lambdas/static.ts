import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { NODE_EMBEDDED_PARAMETERS } from "phylopic-api-models"
import APIError from "../errors/APIError"
import errorToResult from "../errors/errorToResult"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import getIndex from "../operations/getIndex"
import getLicenses from "../operations/getLicenses"
import getRoot from "../operations/getRoot"
import getEmbedParameters from "./parameters/getEmbedParameters"
import getParameters from "./parameters/getParameters"
const route: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> = (event: APIGatewayProxyEvent) => {
    const { path } = event
    switch (path) {
        case "":
        case "/": {
            return getIndex(
                {
                    ...getParameters(event.headers, ["accept"]),
                    ...getParameters(event.queryStringParameters, ["build"]),
                },
                undefined,
            )
        }
        case "/licenses":
        case "/licenses/": {
            return getLicenses(
                {
                    ...getParameters(event.headers, ["accept"]),
                    ...getParameters(event.queryStringParameters, ["build"]),
                },
                undefined,
            )
        }
        case "/root":
        case "/root/": {
            return getRoot(
                {
                    ...getParameters(event.headers, ["accept"]),
                    ...getParameters(event.queryStringParameters, ["build"]),
                    ...getEmbedParameters(event.queryStringParameters, NODE_EMBEDDED_PARAMETERS),
                },
                undefined,
            )
        }
        default: {
            throw new APIError(404, [
                {
                    developerMessage: `Invalid path: "${path}".`,
                    type: "RESOURCE_NOT_FOUND",
                    userMessage: "An invalid request was made.",
                },
            ])
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
