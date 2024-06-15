import {
    ContributorListParameters,
    CONTRIBUTOR_EMBEDDED_PARAMETERS,
    ImageListParameters,
    IMAGE_EMBEDDED_PARAMETERS,
    NodeListParameters,
    NODE_EMBEDDED_PARAMETERS,
} from "@phylopic/api-models"
import type { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import APIError from "../errors/APIError"
import create405 from "../errors/create405"
import errorToResult from "../errors/errorToResult"
import CORS_HEADERS from "../headers/responses/CORS_HEADERS"
import TEMPORARY_HEADERS from "../headers/responses/TEMPORARY_HEADERS"
import getAutocomplete from "../operations/getAutocomplete"
import getCollection from "../operations/getCollection"
import getContributor from "../operations/getContributor"
import getContributors from "../operations/getContributors"
import getImage from "../operations/getImage"
import getImages from "../operations/getImages"
import getImageTags from "../operations/getImageTags"
import getNamespaces from "../operations/getNamespaces"
import getNode from "../operations/getNode"
import getNodeLineage from "../operations/getNodeLineage"
import getNodes from "../operations/getNodes"
import getResolveObject from "../operations/getResolveObject"
import postCollection from "../operations/postCollection"
import getResolveObjects from "../operations/getResolveObjects"
import postResolveObjects from "../operations/postResolveObjects"
import { PgClientService } from "../services/PgClientService"
import getEmbedParameters from "./parameters/getEmbedParameters"
import getParameters from "./parameters/getParameters"
import getUUID from "./parameters/getUUID"
import PG_CLIENT_SERVICE from "./services/PG_CLIENT_SERVICE"
const SERVICE: PgClientService = PG_CLIENT_SERVICE
const CONTRIBUTOR_FILTER_PARAMETERS: ReadonlyArray<keyof ContributorListParameters> = ["filter_collection"]
const NODE_FILTER_PARAMETERS: ReadonlyArray<keyof NodeListParameters> = ["filter_collection", "filter_name"]
const IMAGE_FILTER_PARAMETERS: ReadonlyArray<keyof ImageListParameters> = [
    "filter_clade",
    "filter_collection",
    "filter_contributor",
    "filter_created_after",
    "filter_created_before",
    "filter_license_by",
    "filter_license_nc",
    "filter_license_sa",
    "filter_modified_after",
    "filter_modified_before",
    "filter_modifiedFile_after",
    "filter_modifiedFile_before",
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
        case "/collections":
        case "/collections/": {
            switch (event.httpMethod) {
                case "POST": {
                    return postCollection(
                        {
                            body: event.body ?? undefined,
                            encoding: event.isBase64Encoded ? "base64" : "utf8",
                            ...getParameters(event.headers, ["accept", "content-type"]),
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
                            ...getParameters(event.queryStringParameters, [
                                "build",
                                "page",
                                ...CONTRIBUTOR_FILTER_PARAMETERS,
                            ]),
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
        case "/imagetags":
        case "/imagetags/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getImageTags(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build"]),
                        },
                        SERVICE,
                    )
                }
                default: {
                    throw create405()
                }
            }
        }
        case "/namespaces":
        case "/namespaces/": {
            switch (event.httpMethod) {
                case "GET": {
                    return getNamespaces(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.queryStringParameters, ["build"]),
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
    if (path.startsWith("/collections/")) {
        switch (event.httpMethod) {
            case "GET": {
                return getCollection(
                    {
                        ...getParameters(event.headers, ["accept"]),
                        ...getUUID(event.pathParameters),
                    },
                    SERVICE,
                )
            }
            default: {
                throw create405()
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
                            ...getParameters(event.pathParameters, ["authority", "namespace", "objectID"], true),
                            ...getParameters(event.queryStringParameters, ["build", "objectIDs"]),
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
                case "GET": {
                    return getResolveObjects(
                        {
                            ...getParameters(event.headers, ["accept"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace"]),
                            ...getParameters(event.queryStringParameters, ["build", "objectIDs"], true),
                            ...getEmbedParameters(event.queryStringParameters, NODE_EMBEDDED_PARAMETERS),
                        },
                        SERVICE,
                    )
                }
                case "POST": {
                    return postResolveObjects(
                        {
                            body: event.body ?? undefined,
                            ...getParameters(event.headers, ["accept", "content-type"]),
                            ...getParameters(event.pathParameters, ["authority", "namespace"]),
                            ...getEmbedParameters(event.queryStringParameters, NODE_EMBEDDED_PARAMETERS),
                        },
                        undefined,
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
