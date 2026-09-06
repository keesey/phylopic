import { Authority, createSearch, Namespace, ObjectID, stringifyNormalized } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
import mergeResolveLinkQuery from "./mergeResolveLinkQuery"
import type { PgClientService } from "../services/PgClientService"
import withPgClient from "../services/withPgClient"

const USER_MESSAGE = "There was a problem with an attempt to find taxonomic data."

const selectResolveLinkJSONFromPostgres = async (
    client: ClientBase,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
): Promise<string | null> => {
    const result = await client.query<{ node_uuid: string; title: string | null }>({
        text: `SELECT node_uuid, title FROM node_external WHERE authority=$1 AND "namespace"=$2 AND objectid=$3 AND build=$4::bigint`,
        values: [authority, namespace, objectID, BUILD],
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
    objectID: ObjectID,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
): Promise<string> => {
    const body = await withPgClient(service, client =>
        selectResolveLinkJSONFromPostgres(client, authority, namespace, objectID),
    )
    if (body === null) {
        throw new APIError(404, [
            {
                developerMessage: "Could not resolve.",
                field: "objectID",
                type: "RESOURCE_NOT_FOUND",
                userMessage: USER_MESSAGE,
            },
        ])
    }
    return mergeResolveLinkQuery(body, queryParameters)
}

export default selectResolveLinkJSON
