import { ContributorParameters, DATA_MEDIA_TYPE, isContributorParameters } from "@phylopic/api-models"
import { normalizeUUID } from "@phylopic/utils"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSON from "../entities/selectEntityJSON"
import APIError from "../errors/APIError"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PgClientService } from "../services/PgClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorParameters = DataRequestHeaders & Partial<ContributorParameters>
export type GetContributorService = PgClientService
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
    const client = await service.createPgClient()
    let body: string
    try {
        body = await selectEntityJSON(client, "contributor", normalizedUUID, "contributor")
    } finally {
        await service.deletePgClient(client)
    }
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
