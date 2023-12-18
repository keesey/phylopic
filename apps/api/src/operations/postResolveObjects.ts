import { DATA_MEDIA_TYPE, isResolveObjectParameters, Link, ResolveObjectParameters } from "@phylopic/api-models"
import { Authority, createSearch, isNormalizedText, Namespace, ObjectID, stringifyNormalized } from "@phylopic/utils"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import checkContentType from "../mediaTypes/checkContentType"
import validate from "../validation/validate"
import { Operation } from "./Operation"
import { APIGatewayProxyResult } from "aws-lambda"
const ACCEPT = `application/json,${DATA_MEDIA_TYPE}`
const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."
export type PostResolveObjectsParameters = DataRequestHeaders & {
    "content-type"?: string
} & Partial<Omit<ResolveObjectParameters, "objectID">> & {
        readonly body?: string
    }
const getRedirectLink = (
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Link & { __WARNING__: string } => ({
    __WARNING__: "This method is deprecated, and will return 410 (Gone) in the future.",
    href: `/resolve/${encodeURIComponent(authority ?? "")}/${encodeURIComponent(namespace ?? "")}${createSearch({
        ...queryParameters,
        objectIDs: objectIDs.join(","),
    })}`,
})
const getObjectIDsFromBody = (body: string | null) => {
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
    let objectIDs: ObjectID[]
    try {
        objectIDs = JSON.parse(body)
    } catch (e) {
        throw new APIError(400, [
            {
                developerMessage: "Invalid JSON in body",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    if (!Array.isArray(objectIDs) || !objectIDs.every(item => isNormalizedText(item))) {
        throw new APIError(400, [
            {
                developerMessage: "Expected body to be an array of ID strings.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    return objectIDs
}
export const postResolveObjects: Operation<PostResolveObjectsParameters> = async ({
    accept,
    body,
    "content-type": contentType,
    ...queryAndPathParameters
}) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkContentType(contentType, ACCEPT)
    validate({ ...queryAndPathParameters, objectID: "-" }, isResolveObjectParameters, USER_MESSAGE)
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
    const objectIDs = getObjectIDsFromBody(body)
    const { authority, namespace, ...queryParameters } = queryAndPathParameters
    const link = getRedirectLink(authority ?? "", namespace ?? "", objectIDs, queryParameters)
    return {
        body: stringifyNormalized(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href, true),
            "access-control-allow-methods": "OPTIONS,GET",
            deprecation: "version=v2",
        },
        statusCode: 301,
    } as APIGatewayProxyResult
}
export default postResolveObjects
