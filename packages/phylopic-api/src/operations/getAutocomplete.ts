import { SearchParameters } from "phylopic-api-models/src"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import matchesBuildETag from "../build/matchesBuildETag"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import STANDARD_HEADERS from "../headers/responses/STANDARD_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import MAX_AUTOCOMPLETE_RESULTS from "../search/MAX_AUTOCOMPLETE_RESULTS"
import normalizeQuery from "../search/normalizeQuery"
import { PoolClientService } from "../services/PoolClientService"
import create304 from "../utils/aws/create304"
import { Operation } from "./Operation"
type GetAutocompleteParameters = DataRequestHeaders & Partial<SearchParameters>
type GetAutocompleteService = PoolClientService
const findMatches = async (service: PoolClientService, query: string): Promise<readonly string[]> => {
    if (query.length < 2) {
        return []
    }
    let result: readonly string[]
    const client = await service.getPoolClient()
    try {
        const queryResult = await client.query<{ normalized: string; from_start: boolean }>(
            `SELECT normalized,normalized LIKE $1::character varying AS from_start FROM node_name WHERE build=$2::bigint AND normalized LIKE $3::character varying GROUP BY normalized,from_start ORDER BY from_start DESC,normalized LIMIT ${MAX_AUTOCOMPLETE_RESULTS}`,
            [`${query}%`, BUILD, `%${query}%`],
        )
        result = queryResult.rows.map(({ normalized }) => normalized)
    } finally {
        client.release()
    }
    return result
}
export const getAutocomplete: Operation<GetAutocompleteParameters, GetAutocompleteService> = async (
    { accept, build, "if-none-match": ifNoneMatch, query },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (matchesBuildETag(ifNoneMatch)) {
        return create304()
    }
    if (!build) {
        return createBuildRedirect("/autocomplete", { query })
    }
    checkBuild(build, "There was a problem with a request to find search suggestions.")
    const normalizedQuery = await normalizeQuery(query ?? "")
    const href = `/autocomplete?build=${BUILD}&query=${encodeURIComponent(normalizedQuery)}`
    if (query !== normalizedQuery) {
        return {
            body: "",
            headers: {
                ...createRedirectHeaders(href),
                "cache-control": "public, max-age=8640000",
            },
            statusCode: 308,
        }
    }
    const matches = await findMatches(service, normalizedQuery)
    const body = `{"_links":{"self":{"href":${JSON.stringify(href)}}},"build":${BUILD},"matches":${JSON.stringify(
        matches,
    )}}`
    return {
        body,
        headers: STANDARD_HEADERS,
        statusCode: 200,
    }
}
export default getAutocomplete
