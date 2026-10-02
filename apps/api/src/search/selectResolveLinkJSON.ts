import { type Authority, createSearch, type Namespace, type ObjectID, stringifyNormalized } from "@phylopic/utils"
import type { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
import type { PgClientService } from "../services/PgClientService"
import withPgClient from "../services/withPgClient"
import mergeResolveLinkQuery from "./mergeResolveLinkQuery"

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSONFromPostgres = async (
    client: ClientBase,
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
): Promise<string | null> => {
    const result = await client.query<{ node_uuid: string; title: string | null }>({
        text: `SELECT node_uuid, title FROM node_external WHERE authority=$1 AND "namespace"=$2 AND objectid=ANY($3::text[]) AND build=$4::bigint ORDER BY array_position($3::text[], objectid) LIMIT 1`,
        values: [authority, namespace, objectIDs, BUILD],
    })
    if (result.rows.length === 0) {
        return null
    }
    const { node_uuid, title } = result.rows[0]
    return stringifyNormalized({
        href: `/nodes/${encodeURIComponent(node_uuid)}${createSearch({ build: BUILD })}`,
        title: title ?? "",
    })
}

const selectResolveLinkJSON = async (
    service: PgClientService,
    authority: Authority,
    namespace: Namespace,
    objectIDs: readonly ObjectID[],
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
    notFoundHeaders: Readonly<Record<string, string | number | boolean>> = {},
): Promise<string> => {
    const body = await withPgClient(service, client =>
        selectResolveLinkJSONFromPostgres(client, authority, namespace, objectIDs),
    )
    if (body === null) {
        throw new APIError(
            404,
            [
                {
                    developerMessage: "Could not resolve.",
                    field: objectIDs.length === 1 ? "objectID" : "objectIDs",
                    type: "RESOURCE_NOT_FOUND",
                    userMessage: USER_MESSAGE,
                },
            ],
            notFoundHeaders,
        )
    }
    return mergeResolveLinkQuery(body, queryParameters)
}

export default selectResolveLinkJSON
