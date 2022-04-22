import { ContributorParameters, isContributorParameters } from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-utils/src"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import selectEntityJSON from "../entities/selectEntityJSON"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import createPermanentRedirect from "../results/createPermanentRedirect"
import { PoolClientService } from "../services/PoolClientService"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorParameters = DataRequestHeaders & Partial<ContributorParameters>
export type GetContributorService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to load contributor data."
export const getContributor: Operation<GetContributorParameters, GetContributorService> = async (
    { accept, ...queryParameters },
    service: GetContributorService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate(queryParameters, isContributorParameters, USER_MESSAGE)
    const normalizedUUID = normalizeUUID(queryParameters.uuid as UUID)
    const path = `/contributors/${encodeURIComponent(normalizedUUID)}`
    if (!queryParameters.build) {
        return createBuildRedirect(path, queryParameters)
    }
    if (queryParameters.uuid !== normalizedUUID) {
        return createPermanentRedirect(path, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const client = await service.getPoolClient()
    let body: string
    try {
        body = await selectEntityJSON(client, "contributor", normalizedUUID, "contributor")
    } finally {
        client.release()
    }
    return {
        body,
        headers: DATA_HEADERS,
        statusCode: 200,
    }
}
export default getContributor
