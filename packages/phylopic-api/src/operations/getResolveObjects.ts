import { APIGatewayProxyResult } from "aws-lambda"
import {
    Authority,
    Namespace,
    ObjectID,
    ResolveParameters,
    TitledLink,
    UUID,
    validateResolveParameters,
} from "phylopic-api-types"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
import createRedirectHeaders from "../headers/createRedirectHeaders"
import DATA_HEADERS from "../headers/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolService } from "../services/PoolService"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export interface GetResolveObjectsParameters extends Partial<Omit<ResolveParameters, "objectID">> {
    readonly accept?: string
    readonly body: string | null
}
export type GetResolveObjectsService = PoolService
const getRedirect = async (
    service: PoolService,
    authority: Authority | undefined,
    namespace: Namespace | undefined,
    objectIDs: ObjectID[],
): Promise<TitledLink> => {
    if (!authority || !namespace) {
        throw new APIError(400, [
            {
                developerMessage: "Not enough information to resolve.",
                field: authority ? "namespace" : "authority",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: "There was a problem in a request to find a phylogenetic node.",
            },
        ])
    }
    if (authority === "phylopic.org") {
        throw new APIError(400, [
            {
                developerMessage: "This method is not meant to be used for PhyloPic objects.",
                field: "authority",
                type: "BAD_REQUEST_PARAMETERS",
                userMessage: "There was a problem in a request to find a phylogenetic node.",
            },
        ])
    }
    const client = await service.getPoolClient()
    let link: TitledLink
    try {
        const result = await client.query<{ node_uuid: UUID; title: string | null }>(
            'SELECT node_uuid,title FROM node_external WHERE authority=$1::character varying AND "namespace"=$2::character varying AND objectid=ANY($3::character varying[]) AND build=$4::bigint ORDER BY array_position($3::character varying[],objectid) LIMIT 1',
            [authority, namespace, objectIDs, BUILD],
        )
        if (result.rowCount !== 1) {
            throw new APIError(404, [
                {
                    developerMessage: "Object could not be found. None of the IDs matched.",
                    field: "objectIDs",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage: "There was a problem in a request to find a phylogenetic node.",
                },
            ])
        }
        link = {
            href: `/nodes/` + encodeURIComponent(result.rows[0].node_uuid),
            title: result.rows[0].title ?? "",
        }
    } finally {
        client.release()
    }
    return link
}
export const getResolveObjects: Operation<GetResolveObjectsParameters, GetResolveObjectsService> = async (
    { accept, authority, body, embed, namespace },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!body) {
        throw new APIError(400, [
            {
                developerMessage: "Missing body.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: "There was a problem in a request to find an entity.",
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
                userMessage: "There was a problem in a request to find an entity.",
            },
        ])
    }
    if (!Array.isArray(objectIDs) || !objectIDs.every(item => typeof item === "string" && item.length > 0)) {
        throw new APIError(400, [
            {
                developerMessage: "Expected body to be an array of nonempty strings.",
                field: "body",
                type: "BAD_REQUEST_BODY",
                userMessage: "There was a problem in a request to find an entity.",
            },
        ])
    }
    checkValidation(
        validateResolveParameters({ authority, embed, namespace, objectID: "-" }),
        "There was a problem in a request to find an entity.",
    )
    if (!(objectIDs.length >= 1)) {
        throw new APIError(404, [
            {
                developerMessage: "Object could not be found. None of the IDs matched.",
                field: "objectIDs",
                type: "RESOURCE_NOT_FOUND",
                userMessage: "There was a problem in a request to find a phylogenetic node.",
            },
        ])
    }
    const link = await getRedirect(service, authority, namespace, objectIDs)
    return {
        body: JSON.stringify(link),
        headers: {
            ...DATA_HEADERS,
            ...createRedirectHeaders(link.href + (embed ? `?embed=${encodeURIComponent(embed)}` : "")),
            "access-control-allow-methods": "OPTIONS,POST",
        },
        statusCode: 303,
    } as APIGatewayProxyResult
}
export default getResolveObjects
