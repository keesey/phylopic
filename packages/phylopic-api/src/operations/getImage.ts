import { isImage } from "phylopic-api-models/dist/detection/isImage"
import { IMAGE_EMBEDDED_PARAMETERS } from "phylopic-api-models/dist/queryParameters/constants/IMAGE_EMBEDDED_PARAMETERS"
import { isImageParameters } from "phylopic-api-models/dist/queryParameters/detection/isImageParameters"
import { EmbeddableParameters } from "phylopic-api-models/dist/queryParameters/types/EmbeddableParameters"
import { EntityParameters } from "phylopic-api-models/dist/queryParameters/types/EntityParameters"
import { Image, ImageLinks } from "phylopic-api-models/dist/types/Image"
import { ImageEmbedded } from "phylopic-api-models/dist/types/ImageWithEmbedded"
import { normalizeUUID } from "phylopic-utils/dist/models/normalization/normalizeUUID"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PoolClientService } from "../services/PoolClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImageParameters = DataRequestHeaders & Partial<EntityParameters<ImageEmbedded>>
export type GetImageService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to load silhouette data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<ImageEmbedded> =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    IMAGE_EMBEDDED_PARAMETERS.includes(x as any)
export const getImage: Operation<GetImageParameters, GetImageService> = async (
    { accept, ...queryAndPathParameters },
    service: GetImageService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isImageParameters, USER_MESSAGE)
    const { uuid, ...queryParameters } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/images/${encodeURIComponent(normalizedUUID)}`
    if (!queryParameters.build) {
        return createBuildRedirect(path, queryParameters)
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryParameters)
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
            normalizedUUID,
            embeds,
            isImage,
            "silhouette image",
        )
    } finally {
        client.release()
    }
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getImage
