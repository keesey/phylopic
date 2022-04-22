import { APIGatewayProxyResult } from "aws-lambda"
import {
    Authority,
    Namespace,
    ObjectID,
    ResolveParameters,
    TitledLink,
    validateResolveParameters,
} from "phylopic-api-types"
import APIError from "../errors/APIError"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import getExternalLink from "../search/getExternalLink"
import getInternalLink from "../search/getInternalLink"
import { PoolClientService } from "../services/PoolClientService"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export interface GetResolveObjectParameters extends Partial<ResolveParameters> {
    readonly accept?: string
}
export type GetResolveObjectsService = PoolClientService
const getRedirect = async (
    service: PoolClientService,
    authority: Authority | undefined,
    namespace: Namespace | undefined,
    objectID: ObjectID | undefined,
): Promise<TitledLink> => {
    if (!authority || !namespace || !objectID) {
        throw new APIError(400, [
            {
                developerMessage: "Not enough information to resolve.",
                field: authority ? (namespace ? "objectID" : "namespace") : "authority",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: "There was a problem in a request to find an entity.",
            },
        ])
    }
    const client = await service.getPoolClient()
    let result: TitledLink
    try {
        result = await getExternalLink(client, authority, namespace, objectID)
    } catch (e) {
        if (authority === "phylopic.org" && e instanceof APIError && e.httpCode === 404) {
            result = getInternalLink(namespace, objectID)
        } else {
            throw e
        }
    } finally {
        client.release()
    }
    return result
}
export const getResolveObject: Operation<GetResolveObjectParameters, GetResolveObjectsService> = async (
    { accept, authority, embed, namespace, objectID },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkValidation(
        validateResolveParameters({ authority, embed, namespace, objectID }),
        "There was a problem in a request to find an entity.",
    )
    const link = await getRedirect(service, authority, namespace, objectID)
    return {
        body: JSON.stringify(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href + (embed ? `?embed=${encodeURIComponent(embed)}` : "")),
        },
        statusCode: 307,
    } as APIGatewayProxyResult
}
export default getResolveObject
