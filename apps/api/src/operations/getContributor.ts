import { ContributorParameters, DATA_MEDIA_TYPE, isContributorParameters } from "@phylopic/api-models"
import { normalizeUUID } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import BUILD from "../build/BUILD"
import getS3EntityJSON from "../entities/getS3EntityJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import type { S3ClientService } from "../services/S3ClientService"
import withS3Client from "../services/withS3Client"
import validate from "../validation/validate"
import { Operation } from "./Operation"
import { getEntityJSONKey } from "@phylopic/s3-entities"
export type GetContributorParameters = DataRequestHeaders & Partial<ContributorParameters>
export type GetContributorService = S3ClientService
const USER_MESSAGE = "There was a problem with an attempt to load contributor data."
export const getContributor: Operation<GetContributorParameters, GetContributorService> = async (
    { accept, ...queryAndPathParameters },
    service: GetContributorService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryAndPathParameters, isContributorParameters, USER_MESSAGE)
    const { uuid, ...queryParameters } = queryAndPathParameters
    const normalizedUUID = normalizeUUID(uuid)
    const path = `/contributors/${encodeURIComponent(normalizedUUID)}`
    if (!queryParameters.build) {
        return createBuildRedirect(path, queryParameters)
    }
    if (uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const body = await withS3Client(
        service,
        async client =>
            (await getS3EntityJSON(client, getEntityJSONKey(BUILD, "contributors", normalizedUUID))) ?? "null",
    )
    if (body === "null") {
        throw new APIError(404, [
            {
                developerMessage: "Cannot find entity.",
                field: "uuid",
                type: "RESOURCE_NOT_FOUND",
                userMessage: "That contributor account could not be found.",
            },
        ])
    }
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getContributor
