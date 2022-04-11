import { PoolClient } from "pg"
import { Contributor, ContributorListParameters, validateContributorListParameters } from "phylopic-api-types"
import { DataRequestHeaders } from "../headers/DataRequestHeader"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import checkListRedirect from "../pagination/checkListRedirect"
import getListResult from "../pagination/getListResult"
import { PoolService } from "../services/PoolService"
import create304 from "../utils/aws/create304"
import QueryConfigBuilder from "../utils/postgres/QueryConfigBuilder"
import checkValidation from "../validation/checkValidation"
import { Operation } from "./Operation"
export type GetContributorsParameters = DataRequestHeaders & ContributorListParameters
export type GetContributorsService = PoolService
const ITEMS_PER_PAGE = 96
const USER_MESSAGE = "There was a problem with a request to find contributors."
const getTotalItems = async (client: PoolClient) => {
    const builder = new QueryConfigBuilder(
        "SELECT COUNT(DISTINCT contributor) as total FROM image WHERE build=$::bigint",
        [BUILD],
    )
    const result = await client.query<{ total: number }>(builder.build())
    return result.rows[0].total
}
// :TODO: /contributors/<uuid>?embed=latestImage
const getLinkFromItem = (item: Pick<Contributor, "email">, _embed: readonly string[]) => ({
    href: `mailto:${item.email}`,
})
const getItemLinks = async (client: PoolClient, offset: number, limit: number, embed: readonly string[]) => {
    const builder = new QueryConfigBuilder(
        'SELECT contributor as email FROM image WHERE build=$::bigint GROUP BY email ORDER BY "count" DESC, email OFFSET $::bigint LIMIT $::bigint',
        [BUILD, offset, limit],
    )
    const queryResult = await client.query<Pick<Contributor, "email">>(builder.build())
    return queryResult.rows.map(row => getLinkFromItem(row, embed))
}
// :TODO: /contributors/<uuid>?embed=latestImage
const getItems = async (
    client: PoolClient,
    offset: number,
    limit: number,
    _embed: readonly string[],
): Promise<readonly Contributor[]> => {
    const builder = new QueryConfigBuilder(
        'SELECT contributor as email, COUNT("uuid") AS "count" FROM image WHERE build=$::bigint GROUP BY email ORDER BY "count" DESC, email OFFSET $::bigint LIMIT $::bigint',
        [BUILD, offset, limit],
    )
    const queryResult = await client.query<Pick<Contributor, "count" | "email">>(builder.build())
    return queryResult.rows.map(row => ({
        ...row,
        _links: {
            images: { href: `/images?build=${BUILD}&contributor=${encodeURIComponent(row.email)}` },
            self: { href: `mailto:${row.email}` },
        },
        build: BUILD,
        created: "0000-00-00T00:00:00.000Z",
        uuid: "00000000-0000-0000-0000-000000000000",
    }))
}
export const getContributors: Operation<GetContributorsParameters, GetContributorsService> = async (
    { accept, build, "if-none-match": ifNoneMatch, page },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    checkValidation(validateContributorListParameters({ build, page }), USER_MESSAGE)
    if (checkListRedirect({ build, page }, [], USER_MESSAGE)) {
        return createBuildRedirect("/contributors", {
            ...(page ? { page } : null),
        })
    }
    checkBuild(build, USER_MESSAGE)
    return await getListResult({
        embed: [],
        getItemLinks,
        getItems,
        getLinkFromItem,
        getTotalItems,
        itemsPerPage: ITEMS_PER_PAGE,
        listPath: "/contributors",
        service,
        listQuery: {},
        page,
        userMessage: USER_MESSAGE,
    })
}
export default getContributors
