import { DATA_MEDIA_TYPE } from "@phylopic/api-models"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import { PgClientService } from "../services/PgClientService"
import { Operation } from "./Operation"
export type GetImageTagsParameters = DataRequestHeaders
export type GetImageTagsService = PgClientService
const USER_MESSAGE = "There was a problem with a request to list image tags."
const loadImageTags = async (service: GetImageTagsService): Promise<string> => {
    const client = await service.createPgClient()
    let data = "["
    try {
        const result = await client.query<{ tag: string }>(
            "SELECT DISTINCT unnest(tags) AS tag FROM image ORDER BY tag",
        )
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
export const getImageTags: Operation<GetImageTagsParameters, GetImageTagsService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!queryParameters.build) {
        return createBuildRedirect("/imagetags", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const tags = await loadImageTags(service)
    return {
        body: `{"build":${BUILD},"tags":${tags}}`,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getImageTags
