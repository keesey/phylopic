import { DATA_MEDIA_TYPE, isNodeImageTagsParameters, NodeImageTagsParameters } from "@phylopic/api-models"
import { normalizeUUID, Tag, UUID } from "@phylopic/utils"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PgClientService } from "../services/PgClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetNodeImageTagsParameters = DataRequestHeaders & NodeImageTagsParameters
export type GetNodeImageTagsParametersService = PgClientService
const USER_MESSAGE = "There was a problem with a request to list image tags for a node."
const loadNodeImageTags = async (service: GetNodeImageTagsParametersService, uuid: UUID): Promise<string> => {
    const client = await service.createPgClient()
    let data = "["
    try {
        const builder = new QueryConfigBuilder()
        builder.add(
            `
    WITH RECURSIVE clade AS (
        SELECT "uuid",parent_uuid,build
            FROM node
            WHERE "uuid"=$::uuid AND build=$::bigint
        UNION
            SELECT n."uuid",n.parent_uuid,n.build
                FROM node n
                INNER JOIN clade cl ON cl."uuid"=n.parent_uuid AND cl.build=n.build
    )
    SELECT DISTINCT unnest(image.tags) as tag FROM clade
        LEFT JOIN image_node ON clade."uuid"=image_node.node_uuid AND clade.build=image_node.build
        LEFT JOIN image ON image_node.image_uuid=image."uuid" AND image_node.build=image.build
        WHERE image."uuid" IS NOT NULL
        ORDER BY tag
    `,
            [uuid, BUILD],
        )
        const result = await client.query<{ tag: Tag }>(builder.build())
        result.rows.forEach(({ tag }, index) => {
            if (index) {
                data += ","
            }
            data += JSON.stringify(tag)
        })
    } finally {
        await service.deletePgClient(client)
    }
    return data + "]"
}
export const getNodeImageTags: Operation<GetNodeImageTagsParameters, GetNodeImageTagsParametersService> = async (
    { accept, ...queryAndPathParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isNodeImageTagsParameters, USER_MESSAGE)
    const { uuid } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/nodes/${encodeURIComponent(normalizedUUID)}/imagetags`
    if (!queryAndPathParameters.build) {
        return createBuildRedirect(path, queryAndPathParameters)
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryAndPathParameters)
    }
    checkBuild(queryAndPathParameters.build, USER_MESSAGE)
    const tags = await loadNodeImageTags(service, uuid)
    return {
        body: `{"build":${BUILD},"tags":${tags}}`,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getNodeImageTags
