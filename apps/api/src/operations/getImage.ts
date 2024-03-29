import {
    DATA_MEDIA_TYPE,
    EmbeddableParameters,
    EntityParameters,
    Image,
    ImageEmbedded,
    ImageLinks,
    IMAGE_EMBEDDED_PARAMETERS,
    isImage,
    isImageParameters,
} from "@phylopic/api-models"
import { normalizeUUID } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSONWithEmbedded from "../entities/selectEntityJSONWithEmbedded"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetImageParameters = DataRequestHeaders & Partial<EntityParameters<ImageEmbedded>>
export type GetImageService = PgClientService
const USER_MESSAGE = "There was a problem with an attempt to load silhouette data."
const isEmbeddedParameter = (x: unknown): x is string & keyof EmbeddableParameters<ImageEmbedded> =>
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
    const client = await service.createPgClient()
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
        await service.deletePgClient(client)
    }
    if (body === "null") {
        throw new APIError(404, [
            {
                developerMessage: "Cannot find entity.",
                field: "uuid",
                type: "RESOURCE_NOT_FOUND",
                userMessage: "That silhouette image could not be found.",
            },
        ])
    }
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getImage
