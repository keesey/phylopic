import { TitledLink } from "@phylopic/api-models"
import { Authority, createSearch, Namespace, ObjectID, Query, UUID } from "@phylopic/utils"
import { PoolClient } from "pg"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
const getExternalLink = async (
    client: PoolClient,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
    queryParameters: Query,
): Promise<TitledLink> => {
    const result = await client.query<{ node_uuid: UUID; title: string | null }>(
        'SELECT node_uuid,title FROM node_external WHERE authority=$1::character varying AND "namespace"=$2::character varying AND objectid=$3::character varying AND build=$4::bigint LIMIT 1',
        [authority, namespace, objectID, BUILD],
    )
    if (result.rowCount !== 1) {
        throw new APIError(404, [
            {
                developerMessage: "Could not resolve.",
                type: "RESOURCE_NOT_FOUND",
                userMessage: "There was a problem in a request to find a taxonomic group.",
            },
        ])
    }
    return {
        href: `/nodes/${encodeURIComponent(result.rows[0].node_uuid)}` + createSearch(queryParameters),
        title: result.rows[0].title ?? "",
    }
}
export default getExternalLink
