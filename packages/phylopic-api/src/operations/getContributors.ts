import { ClientBase } from "pg"
import CONTRIBUTOR_EMBEDDED_PARAMETERS from "phylopic-api-models/dist/queryParameters/constants/CONTRIBUTOR_EMBEDDED_PARAMETERS"
import isContributorListParameters from "phylopic-api-models/dist/queryParameters/detection/isContributorListParameters"
import { ContributorListParameters } from "phylopic-api-models/dist/queryParameters/types/ContributorListParameters"
import { Link } from "phylopic-api-models/dist/types/Link"
import { UUID } from "phylopic-utils/dist/models/types/UUID"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PoolClientService } from "../services/PoolClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorsParameters = DataRequestHeaders & ContributorListParameters
export type GetContributorsService = PoolClientService
const ITEMS_PER_PAGE = 96
const USER_MESSAGE = "There was a problem with a request to list contributors."
const getTotalItems = async (client: ClientBase) => {
    const builder = new QueryConfigBuilder('SELECT COUNT("uuid") AS total FROM contributor WHERE build=$::bigint', [
        BUILD,
    ])
    const result = await client.query<{ total: number }>(builder.build())
    return result.rows[0].total
}
const getItemLinks = async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
    const queryResult = await client.query<{ uuid: UUID }>({
        text: 'SELECT "uuid" FROM contributor WHERE build=$::bigint ORDER BY sort_index OFFSET $ LIMIT $',
        values: [BUILD, offset, limit],
    })
    return queryResult.rows.map(({ uuid }) => ({ href: `/contributors/${uuid}?build=${BUILD}` }))
}
// :TODO: /contributors/<uuid>?embed=latestImage
const getItemLinksAndJSON = async (
    client: ClientBase,
    offset: number,
    limit: number,
    /*embed: ReadonlyArray<string & keyof ContributorEmbedded>,*/
): Promise<ReadonlyArray<Readonly<[Link, string]>>> => {
    const queryResult = await client.query<{ json: string; uuid: UUID }>({
        text: "SELECT json,uuid FROM contributor WHERE build=$::bigint ORDER BY sort_index OFFSET $ LIMIT $",
        values: [BUILD, offset, limit],
    })
    return queryResult.rows.map(({ json, uuid }) => [{ href: `/contributors/${uuid}?build=${BUILD}` }, json])
}
export const getContributors: Operation<GetContributorsParameters, GetContributorsService> = async (
    { accept, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    validate<ContributorListParameters>(queryParameters, isContributorListParameters, USER_MESSAGE)
    if (checkListRedirect(queryParameters, CONTRIBUTOR_EMBEDDED_PARAMETERS, USER_MESSAGE)) {
        return createBuildRedirect("/contributors", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        getItemLinks,
        getItemLinksAndJSON,
        getTotalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/contributors",
        service,
        listQuery: queryParameters,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: [],
    })
}
export default getContributors
