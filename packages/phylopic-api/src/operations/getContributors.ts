import { ClientBase } from "pg"
import { ContributorListParameters, isContributorListParameters, Link } from "phylopic-api-models/src"
import { UUID } from "phylopic-utils/src"
import checkIfMatchBuild from "../build/checkIfMatchBuild"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import { ListRequestHeaders } from "../headers/requests/ListRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorsParameters = ListRequestHeaders & ContributorListParameters
export type GetContributorsService = PoolClientService
const ITEMS_PER_PAGE = 96
const USER_MESSAGE = "There was a problem with a request to list contributors."
const getTotalItems = async (client: ClientBase) => {
    const builder = new QueryConfigBuilder("SELECT COUNT(uuid) as total FROM contributor WHERE build=$::bigint", [
        BUILD,
    ])
    const result = await client.query<{ total: number }>(builder.build())
    return result.rows[0].total
}
const getItemLinks = async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
    const queryResult = await client.query<{ uuid: UUID }>({
        text: "SELECT uuid from contributor WHERE build=$::bigint ORDER BY sort_index OFFSET $::bigint LIMIT $::bigint",
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
        text: "SELECT json,uuid from contributor WHERE build=$::bigint ORDER BY sort_index OFFSET $::bigint LIMIT $::bigint",
        values: [BUILD, offset, limit],
    })
    return queryResult.rows.map(({ json, uuid }) => [{ href: `/contributors/${uuid}?build=${BUILD}` }, json])
}
export const getContributors: Operation<GetContributorsParameters, GetContributorsService> = async (
    { accept, "if-match": ifMatch, "if-none-match": ifNoneMatch, ...queryParameters },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    checkIfMatchBuild(ifMatch)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    if (!queryParameters.build) {
        return createBuildRedirect("/contributors")
    }
    validate(queryParameters, isContributorListParameters, USER_MESSAGE)
    if (checkListRedirect(queryParameters, [], USER_MESSAGE)) {
        return createBuildRedirect("/contributors", queryParameters)
    }
    checkBuild(queryParameters.build, USER_MESSAGE)
    return await getListResult({
        embed: [],
        getItemLinks,
        getItemLinksAndJSON,
        getTotalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/contributors",
        service,
        listQuery: {},
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
    })
}
export default getContributors
