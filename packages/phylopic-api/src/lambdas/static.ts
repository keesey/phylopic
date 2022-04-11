import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import APIError from "../errors/APIError"
import errorToResult from "../errors/errorToResult"
import getLicenses from "../operations/getLicenses"
import getIndex from "../operations/getIndex"
import getRoot from "../operations/getRoot"
import getParameters from "./parameters/getParameters"
const route: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> = (event: APIGatewayProxyEvent) => {
    const { path } = event
    switch (path) {
        case "":
        case "/": {
            return getIndex(getParameters(event.headers, ["accept", "if-none-match"]), undefined)
        }
        case "/licenses":
        case "/licenses/": {
            return getLicenses(getParameters(event.headers, ["accept", "if-none-match"]), undefined)
        }
        case "/root":
        case "/root/": {
            return getRoot(getParameters(event.queryStringParameters, ["embed"]), undefined)
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
    return result
}
