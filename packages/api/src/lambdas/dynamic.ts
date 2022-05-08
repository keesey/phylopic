import {
    CONTRIBUTOR_EMBEDDED_PARAMETERS,
    ImageListParameters,
    IMAGE_EMBEDDED_PARAMETERS,
    NodeListParameters,
    NODE_EMBEDDED_PARAMETERS,
} from "@phylopic/api-models"
import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import TEMPORARY_HEADERS from "src/headers/responses/TEMPORARY_HEADERS"
import APIError from "../errors/APIError"
import create405 from "../errors/create405"
import errorToResult from "../errors/errorToResult"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import getAutocomplete from "../operations/getAutocomplete"
import getContributor from "../operations/getContributor"
import getContributors from "../operations/getContributors"
import getImage from "../operations/getImage"
import getImages from "../operations/getImages"
import getNode from "../operations/getNode"
import getNodeLineage from "../operations/getNodeLineage"
import getNodes from "../operations/getNodes"
import getResolveObject from "../operations/getResolveObject"
import getResolveObjects from "../operations/getResolveObjects"
import { PoolClientService } from "../services/PoolClientService"
import { S3Service } from "../services/S3Service"
import getEmbedParameters from "./parameters/getEmbedParameters"
import getParameters from "./parameters/getParameters"
import getUUID from "./parameters/getUUID"
import POOL_CLIENT_SERVICE from "./services/POOL_CLIENT_SERVICE"
import S3_SERVICE from "./services/S3_SERVICE"
const SERVICE: PoolClientService & S3Service = {
    ...POOL_CLIENT_SERVICE,
    ...S3_SERVICE,
}
const NODE_FILTER_PARAMETERS: ReadonlyArray<keyof NodeListParameters> = ["filter_name"]
const IMAGE_FILTER_PARAMETERS: ReadonlyArray<keyof ImageListParameters> = [
    "filter_clade",
    "filter_contributor",
    "filter_license_by",
    "filter_license_nc",
    "filter_license_sa",
    "filter_name",
    "filter_node",
]
const getEntityParameters = (event: APIGatewayProxyEvent, embeddedParameters: readonly string[]) => ({
    ...getParameters(event.headers, ["accept"]),
    ...getParameters(event.queryStringParameters, ["build"]),
    ...getEmbedParameters(event.queryStringParameters, embeddedParameters),
    ...getUUID(event.pathParameters),
})
const route: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult> = (event: APIGatewayProxyEvent) => {
    const { path } = event
    switch (path) {
        case "/autocomplete":
        case "/autocomplete/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getAutocomplete(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build", "query"]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
        case "/contributors":
        case "/contributors/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getContributors(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build", "page"]),
                            ...getEmbedParameters(event.queryStringParameters, [
                                "embed_items" as const,
                                ...CONTRIBUTOR_EMBEDDED_PARAMETERS,
                            ]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
        case "/images":
        case "/images/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getImages(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, [
                                "build",
                                "page",
                                ...IMAGE_FILTER_PARAMETERS,
                            ]),
                            ...getEmbedParameters(event.queryStringParameters, [
                                "embed_items" as const,
                                ...IMAGE_EMBEDDED_PARAMETERS,
                            ]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
        case "/nodes":
        case "/nodes/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getNodes(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build", "page", ...NODE_FILTER_PARAMETERS]),
                            ...getEmbedParameters(event.queryStringParameters, [
                                "embed_items" as const,
                                ...NODE_EMBEDDED_PARAMETERS,
                            ]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
    }
    if (path.startsWith("/contributors/")) {
        switch (event.httpMethod) {
            case "GET": {
                return getContributor(getEntityParameters(event, CONTRIBUTOR_EMBEDDED_PARAMETERS), SERVICE)
            }
            default: {
                throw create405()
            }
        }
    }
    if (path.startsWith("/images/")) {
        switch (event.httpMethod) {
            case "GET": {
                return getImage(getEntityParameters(event, IMAGE_EMBEDDED_PARAMETERS), SERVICE)
            }
            default: {
                throw create405()
            }
        }
    }
    if (path.startsWith("/nodes/")) {
        if (path.endsWith("/lineage") || path.endsWith("/lineage/")) {
            switch (event.httpMethod) {
                case "GET": {
                    return getNodeLineage(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build", "page"]),
                            ...getEmbedParameters(event.queryStringParameters, [
                                "embed_items" as const,
                                ...NODE_EMBEDDED_PARAMETERS,
                            ]),
                            ...getUUID(event.pathParameters),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        } else {
            switch (event.httpMethod) {
                case "GET": {
                    return getNode(getEntityParameters(event, NODE_EMBEDDED_PARAMETERS), SERVICE)
                }
                default: {
                    throw create405()
                }
            }
        }
    }
    if (path.startsWith("/resolve/")) {
        if (event.pathParameters?.objectID) {
            switch (event.httpMethod) {
                case "GET": {
                    return getResolveObject(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace", "objectID"]),
                            ...getEmbedParameters(event.queryStringParameters, NODE_EMBEDDED_PARAMETERS),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        } else {
            switch (event.httpMethod) {
                case "POST": {
                    return getResolveObjects(
                        {
                            body: event.body ?? undefined,
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace"]),
                            ...getEmbedParameters(event.queryStringParameters, NODE_EMBEDDED_PARAMETERS),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
    }
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
export const onAPIGatewayProxy: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
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
