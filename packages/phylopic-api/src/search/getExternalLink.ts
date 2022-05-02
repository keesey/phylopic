import { PoolClient } from "pg"
import { TitledLink } from "phylopic-api-models/dist/types/TitledLink"
import createSearch from "phylopic-utils/dist/http/createSearch"
import { Authority } from "phylopic-utils/dist/models/types/Authority"
import { Namespace } from "phylopic-utils/dist/models/types/Namespace"
import { ObjectID } from "phylopic-utils/dist/models/types/ObjectID"
import { UUID } from "phylopic-utils/dist/models/types/UUID"
import BUILD from "../build/BUILD"
import APIError from "../errors/APIError"
const getExternalLink = async (
    client: PoolClient,
    authority: Authority,
    namespace: Namespace,
    objectID: ObjectID,
    queryParameters: Readonly<Record<string, string | number | boolean | undefined>>,
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
