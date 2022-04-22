import {
    EmbeddableParameters,
    EntityParameters,
    Image,
    ImageEmbedded,
    ImageLinks,
    IMAGE_EMBEDDED_PARAMETERS,
    isEntityParameters,
    isImage,
} from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-utils/src"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import STANDARD_HEADERS from "../headers/responses/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImageParameters = DataRequestHeaders & Partial<EntityParameters<ImageEmbedded>>
export type GetImageService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to load silhouette data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<ImageEmbedded> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMAGE_EMBEDDED_PARAMETERS.includes(x as any)
export const getImage: Operation<GetImageParameters, GetImageService> = async (
    { accept, "if-none-match": ifNoneMatch, ...queryParameters },
    service: GetImageService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    validate(queryParameters, isEntityParameters(IMAGE_EMBEDDED_PARAMETERS), USER_MESSAGE)
    const uuid = normalizeUUID(queryParameters.uuid as UUID)
    if (!queryParameters.build) {
        return createBuildRedirect(`/image/${encodeURIComponent(uuid)}`, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const embeds = Object.keys(queryParameters)
        .filter(isEmbeddedParameter)
        .map(key => key.slice("embed_".length) as string & keyof ImageEmbedded)
    const client = await service.getPoolClient()
    let body: string
    try {
        body = await selectEntityJSONWithEmbedded<Image, ImageLinks>(
            client,
            "image",
            uuid,
            embeds,
            isImage,
            "silhouette image",
        )
    } finally {
        client.release()
    }
    return {
        body,
        headers: STANDARD_HEADERS,
        statusCode: 200,
    }
}
export default getImage
