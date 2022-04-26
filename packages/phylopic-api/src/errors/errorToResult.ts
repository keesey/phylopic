import { APIGatewayProxyResult } from "aws-lambda"
import type { Error as ErrorModel } from "phylopic-api-models"
import BUILD from "../build/BUILD"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import APIError from "./APIError"
const fromAPIError = (e: APIError, stack: string | null): APIGatewayProxyResult => ({
    body: JSON.stringify({ build: BUILD, errors: e.data, stack }),
    headers: {
        ...CORS_HEADERS,
        ...DATA_HEADERS,
        ...e.additionalHeaders,
    },
    statusCode: e.httpCode,
})
const errorToResult = (e: unknown): APIGatewayProxyResult => {
    const stack = e instanceof Error && typeof e.stack === "string" ? e.stack : null
    if (e instanceof APIError) {
        return fromAPIError(e, stack)
    }
    const errors: readonly ErrorModel[] = [
        {
            developerMessage: String(e) || "Unknown error.",
            type: "DEFAULT_5XX",
            userMessage: "An unexpected error occurred.",
        },
    ]
    return {
        body: JSON.stringify({ build: BUILD, errors, stack }),
        headers: {
            ...CORS_HEADERS,
            ...DATA_HEADERS,
        },
        statusCode: 500,
    }
}
export default errorToResult
