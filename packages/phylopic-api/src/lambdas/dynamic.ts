import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { ImageListParameters, NodeListParameters } from "phylopic-api-types"
import APIError from "../errors/APIError"
import create405 from "../errors/create405"
import errorToResult from "../errors/errorToResult"
import getAutocomplete from "../operations/getAutocomplete"
import getContributors from "../operations/getContributors"
import getImage from "../operations/getImage"
import getImages from "../operations/getImages"
import getNode from "../operations/getNode"
import getNodeLineage from "../operations/getNodeLineage"
import getNodes from "../operations/getNodes"
import getResolveObject from "../operations/getResolveObject"
import getResolveObjects from "../operations/getResolveObjects"
import { PoolService } from "../services/PoolService"
import { RedisService } from "../services/RedisService"
import { S3Service } from "../services/S3Service"
import getParameters from "./parameters/getParameters"
import getUUID from "./parameters/getUUID"
import POOL_SERVICE from "./services/POOL_SERVICE"
import REDIS_SERVICE from "./services/REDIS_SERVICE"
import S3_SERVICE from "./services/S3_SERVICE"
const SERVICE: PoolService & RedisService & S3Service = {
    ...POOL_SERVICE,
    ...REDIS_SERVICE,
    ...S3_SERVICE,
}
const NODE_FILTER_PARAMS: ReadonlyArray<keyof NodeListParameters> = ["name"]
const IMAGE_FILTER_PARAMS: ReadonlyArray<keyof ImageListParameters> = [
    "clade",
    "contributor",
    "license_by",
    "license_nc",
    "license_sa",
    "name",
    "node",
]
const getEntityParameters = (event: APIGatewayProxyEvent) => ({
    ...getParameters(event.headers, ["accept", "if-none-match"]),
    ...getParameters(event.queryStringParameters, ["embed"]),
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
                            ...getParameters(event.headers, ["accept", "if-none-match"]),
                            ...getParameters(event.queryStringParameters, ["query"]),
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
                            ...getParameters(event.headers, ["accept", "if-match", "if-none-match"]),
                            ...getParameters(event.queryStringParameters, ["length", "start"]),
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
                            ...getParameters(event.headers, ["accept", "if-match", "if-none-match"]),
                            ...getParameters(event.queryStringParameters, [
                                ...IMAGE_FILTER_PARAMS,
                                "embed",
                                "length",
                                "start",
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
                            ...getParameters(event.headers, ["accept", "if-match", "if-none-match"]),
                            ...getParameters(event.queryStringParameters, [
                                ...NODE_FILTER_PARAMS,
                                "embed",
                                "length",
                                "start",
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
    if (path.startsWith("/images/")) {
        switch (event.httpMethod) {
            case "GET": {
                return getImage(getEntityParameters(event), SERVICE)
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
                            ...getParameters(event.headers, ["accept", "if-match", "if-none-match"]),
                            ...getParameters(event.queryStringParameters, ["embed", "length", "start"]),
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
                    return getNode(getEntityParameters(event), SERVICE)
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
                            ...getParameters(event.queryStringParameters, ["embed"]),
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace", "objectID"]),
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
                            body: event.body,
                            ...getParameters(event.queryStringParameters, ["embed"]),
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace"]),
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
    throw new APIError(404, [
        {
            developerMessage: `Invalid path: "${path}".`,
            type: "RESOURCE_NOT_FOUND",
            userMessage: "An invalid request was made.",
        },
    ])
}
export const onAPIGatewayProxy: APIGatewayProxyHandler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false
    let result: APIGatewayProxyResult
    try {
        result = await route(event)
    } catch (e) {
        result = errorToResult(e)
    }
    return result
}
