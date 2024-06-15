import {
    ContributorListParameters,
    CONTRIBUTOR_EMBEDDED_PARAMETERS,
    DATA_MEDIA_TYPE,
    isContributorListParameters,
    Link,
    TitledLink,
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
const DEFAULT_TITLE = "[Anonymous]"
const ITEMS_PER_PAGE = 96
const USER_MESSAGE = "There was a problem with a request to list contributors."
const getQueryBuilder = (parameters: ContributorListParameters, results: "total" | "href" | "json") => {
    const builder = new QueryConfigBuilder()
    const selection =
        results === "total"
            ? 'COUNT(contributor."uuid") as total'
            : results === "href"
              ? 'contributor.title AS title,contributor."uuid" AS "uuid"'
              : 'contributor.json AS json,contributor.title AS title,contributor."uuid" AS "uuid"'
    if (parameters.filter_collection) {
        builder.add(
            `SELECT ${selection} FROM collection LEFT JOIN contributor ON contributor."uuid"=ANY(collection.uuids) WHERE collection.uuid=$::uuid AND contributor.build=$::bigint`,
            [parameters.filter_collection, BUILD],
        )
    } else {
        builder.add(`SELECT ${selection} FROM contributor WHERE build=$::bigint`, [BUILD])
    }
    if (results === "total") {
        // Add nothing
    } else {
        builder.add("ORDER BY contributor.sort_index")
    }
    return builder
}
const getTotalItems = (parameters: ContributorListParameters) => async (client: ClientBase) => {
    const query = getQueryBuilder(parameters, "total").build()
    const queryResult = await client.query<{ total: string }>(query)
    return parseInt(queryResult.rows[0].total, 10) || 0
}
const getItemLinks =
    (parameters: ContributorListParameters) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly TitledLink[]> => {
        const queryBuilder = getQueryBuilder(parameters, "href")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ title: string; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ title, uuid }) => ({
            href: `/contributors/${uuid}?build=${BUILD}`,
            title: title || DEFAULT_TITLE,
        }))
    }
const getItemLinksAndJSON =
    (parameters: ContributorListParameters) =>
    async (
        client: ClientBase,
        offset: number,
        limit: number,
        // :TODO: embed_latestImage
        // embeds: ReadonlyArray<string & keyof {}>,
    ): Promise<ReadonlyArray<Readonly<[TitledLink, string]>>> => {
        const queryBuilder = getQueryBuilder(parameters, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; title: string; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows.map(({ json, title, uuid }) => [
            { href: `/contributors/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
            json,
        ])
        // :TODO: embeds
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
        getItemLinks: getItemLinks(queryParameters),
        getItemLinksAndJSON: getItemLinksAndJSON(queryParameters),
        getTotalItems: getTotalItems(queryParameters),
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
