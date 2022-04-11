import { EntityParameters, ImageEmbedded, UUID, validateImageParameters } from "phylopic-api-types"
import { DataRequestHeaders } from "../headers/DataRequestHeader"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import getEntityJSON from "../entities/get"
import imageType from "../entities/image"
import STANDARD_HEADERS from "../headers/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { S3Service } from "../services/S3Service"
import create304 from "../utils/aws/create304"
import normalizeUUIDv4 from "../utils/uuid/normalizeUUIDv4"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export type GetImageParameters = DataRequestHeaders & EntityParameters<ImageEmbedded> & {
    uuid: UUID
}
export type GetImageService = S3Service
const USER_MESSAGE = "There was a problem with an attempt to load silhouette data."
export const getImage: Operation<GetImageParameters, GetImageService> = async (
    { accept, build, embed_generalNode, embed_nodes, embed_specificNode, "if-none-match": ifNoneMatch, uuid },
    service: GetImageService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    uuid = normalizeUUIDv4(uuid, imageType.userLabel)
    const query = { embed_generalNode, embed_nodes, embed_specificNode }
    checkValidation(validateImageParameters(query), USER_MESSAGE)
    if (!build) {
        return createBuildRedirect(`/images/${encodeURIComponent(uuid)}`, query)
    }
    checkBuild(build, USER_MESSAGE)
    const client = service.getS3Client()
    let body: string
    try {
        body = await getEntityJSON(client, query, uuid, imageType)
    } finally {
        client.destroy()
    }
    return {
        body,
        headers: STANDARD_HEADERS,
        statusCode: 200,
    }
}
export default getImage
