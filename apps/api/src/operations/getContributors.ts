import {
    ContributorListParameters,
    CONTRIBUTOR_EMBEDDED_PARAMETERS,
    DATA_MEDIA_TYPE,
    isContributorListParameters,
    TitledLink,
} from "@phylopic/api-models"
import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { getListIndexKey, getListPageKey } from "@phylopic/s3-entities"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import checkAccept from "../mediaTypes/checkAccept"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult, { ListPageRow } from "../pagination/getListResult"
import getPostgresListResult from "../pagination/getPostgresListResult"
import { canServeListFromS3, isUnfilteredContributorsList } from "../pagination/isS3ListEligible"
import { PgClientService } from "../services/PgClientService"
import { S3Client } from "@aws-sdk/client-s3"
import type { S3ClientService } from "../services/S3ClientService"
import QueryConfigBuilder from "../sql/QueryConfigBuilder"
import validate from "../validation/validate"
import { Operation } from "./Operation"
export type GetContributorsParameters = DataRequestHeaders & ContributorListParameters
export type GetContributorsService = PgClientService & S3ClientService

const DEFAULT_TITLE = "[Anonymous]"

const ITEMS_PER_PAGE = 96

const USER_MESSAGE = "There was a problem with a request to list contributors."

const VALID_EMBEDS: readonly string[] = []

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
    builder.add("AND contributor.unlisted=0::bit")
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

const fetchListPageRows =
    (parameters: ContributorListParameters) =>
    async (client: ClientBase, offset: number, limit: number): Promise<readonly ListPageRow[]> => {
        const queryBuilder = getQueryBuilder(parameters, "json")
        queryBuilder.add("OFFSET $ LIMIT $", [offset, limit])
        const queryResult = await client.query<{ json: string; title: string; uuid: UUID }>(queryBuilder.build())
        return queryResult.rows
    }

const embedListPageRows =
    (_parameters: ContributorListParameters) =>
    async (
        rows: readonly ListPageRow[],
        _embeds: readonly string[],
        _client: S3Client,
    ): Promise<readonly Readonly<[TitledLink, string]>[]> => {
        return rows.map(({ json, title, uuid }) => [
            { href: `/contributors/${uuid}?build=${BUILD}`, title: title || DEFAULT_TITLE },
            json,
        ])
        // :TODO: embeds
    }

const isEligible = (listQuery: Readonly<Record<string, string | number | boolean | undefined>>) =>
    isUnfilteredContributorsList(listQuery as ContributorListParameters)

const S3_LIST = {
    getIndexKey: () => getListIndexKey(BUILD, "contributors"),
    getPageKey: (pageIndex: number) => getListPageKey(BUILD, "contributors", pageIndex),
    isEligible,
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
    const listParameters = {
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/contributors",
        listQuery: queryParameters,
        page: queryParameters.page,
        userMessage: USER_MESSAGE,
        validEmbeds: VALID_EMBEDS,
    }
    if (canServeListFromS3(queryParameters, isEligible, VALID_EMBEDS)) {
        return await getListResult({
            ...listParameters,
            service,
            s3List: S3_LIST,
        })
    }
    return await getPostgresListResult({
        ...listParameters,
        embedListPageRows: embedListPageRows(queryParameters),
        fetchListPageRows: fetchListPageRows(queryParameters),
        getItemLinks: getItemLinks(queryParameters),
        getTotalItems: getTotalItems(queryParameters),
        service,
    })
}

export default getContributors
