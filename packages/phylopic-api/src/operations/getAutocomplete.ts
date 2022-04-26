import { SearchParameters } from "phylopic-api-models"
import { createSearch } from "phylopic-utils"
import BUILD from "../build/BUILD"
import checkBuild from "../build/checkBuild"
import createBuildRedirect from "../build/createBuildRedirect"
import { DataRequestHeaders } from "../headers/requests/DataRequestHeaders"
import createRedirectHeaders from "../headers/responses/createRedirectHeaders"
import DATA_HEADERS from "../headers/responses/DATA_HEADERS"
import PERMANENT_HEADERS from "../headers/responses/PERMANENT_HEADERS"
import checkAccept from "../mediaTypes/checkAccept"
import DATA_MEDIA_TYPE from "../mediaTypes/DATA_MEDIA_TYPE"
import MAX_AUTOCOMPLETE_RESULTS from "../search/MAX_AUTOCOMPLETE_RESULTS"
import normalizeQuery from "../search/normalizeQuery"
import { PoolClientService } from "../services/PoolClientService"
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
    { accept, build, query },
    service,
) => {
    checkAccept(accept, DATA_MEDIA_TYPE)
    if (!build) {
        return createBuildRedirect("/autocomplete", { query })
    }
    checkBuild(build, "There was a problem with a request to find search suggestions.")
    const normalizedQuery = await normalizeQuery(query ?? "")
    const href = "/autocomplete" + createSearch({ build, query: normalizedQuery })
    if (query !== normalizedQuery) {
        return {
            body: "",
            headers: createRedirectHeaders(href, true),
            statusCode: 308,
        }
    }
    const matches = await findMatches(service, normalizedQuery)
    const body = `{"_links":{"self":{"href":${JSON.stringify(href)}}},"build":${BUILD},"matches":${JSON.stringify(
        matches,
    )}}`
    return {
        body,
        headers: { ...DATA_HEADERS, ...PERMANENT_HEADERS },
        statusCode: 200,
    }
}
export default getAutocomplete
