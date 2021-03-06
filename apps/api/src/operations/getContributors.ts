import {
    ContributorListParameters,
    CONTRIBUTOR_EMBEDDED_PARAMETERS,
    DATA_MEDIA_TYPE,
    isContributorListParameters,
    Link,
} from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PgClientService } from "../services/PgClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorsParameters = DataRequestHeaders & ContributorListParameters
export type GetContributorsService = PgClientService
const ITEMS_PER_PAGE = 96
const USER_MESSAGE = "There was a problem with a request to list contributors."
const getTotalItems = async (client: ClientBase) => {
    const builder = new QueryConfigBuilder('SELECT COUNT("uuid") AS total FROM contributor WHERE build=$::bigint', [
        BUILD,
    ])
    const result = await client.query<{ total: string }>(builder.build())
    return parseInt(result.rows[0].total, 10) ?? 0
}
const getItemLinks = async (client: ClientBase, offset: number, limit: number): Promise<readonly Link[]> => {
    const queryResult = await client.query<{ uuid: UUID }>({
        text: 'SELECT "uuid" FROM contributor WHERE build=$1::bigint ORDER BY sort_index OFFSET $2 LIMIT $3',
        values: [BUILD, offset, limit],
    })
    return queryResult.rows.map(({ uuid }) => ({ href: `/contributors/${uuid}?build=${BUILD}` }))
}
// :TODO: /contributors/<uuid>?embed_latestImage=true
const getItemLinksAndJSON = async (
    client: ClientBase,
    offset: number,
    limit: number,
    /*embed: ReadonlyArray<string & keyof ContributorEmbedded>,*/
): Promise<ReadonlyArray<Readonly<[Link, string]>>> => {
    const queryResult = await client.query<{ json: string; uuid: UUID }>({
        text: "SELECT json,uuid FROM contributor WHERE build=$1::bigint ORDER BY sort_index OFFSET $2 LIMIT $3",
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
