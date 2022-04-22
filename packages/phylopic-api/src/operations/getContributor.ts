import { CONTRIBUTOR_EMBEDDED_PARAMETERS, EntityParameters, isEntityParameters } from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-utils/src"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import selectEntityJSON from "../entities/selectEntityJSON"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import STANDARD_HEADERS from "../headers/responses/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorParameters = DataRequestHeaders & Partial<EntityParameters<Record<string, never>>>
export type GetContributorService = PoolClientService
const USER_MESSAGE = "There was a problem with an attempt to load contributor data."
export const getContributor: Operation<GetContributorParameters, GetContributorService> = async (
    { accept, "if-none-match": ifNoneMatch, ...queryParameters },
    service: GetContributorService,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    validate(queryParameters, isEntityParameters(CONTRIBUTOR_EMBEDDED_PARAMETERS), USER_MESSAGE)
    const uuid = normalizeUUID(queryParameters.uuid as UUID)
    if (!queryParameters.build) {
        return createBuildRedirect(`/contributor/${encodeURIComponent(uuid)}`, queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    const client = await service.getPoolClient()
    let body: string
    try {
        body = await selectEntityJSON(client, "contributor", uuid, "contributor")
    } finally {
        client.release()
    }
    return {
        body,
        headers: STANDARD_HEADERS,
        statusCode: 200,
    }
}
export default getContributor
