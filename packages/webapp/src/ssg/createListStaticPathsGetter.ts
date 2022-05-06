import { ListParameters, Page } from "@phylopic/api-models"
import { createSearch, isDefined, Query } from "@phylopic/utils"
import { GetStaticPaths, GetStaticPathsResult } from "next"
import fetchData from "~/fetch/fetchData"
import extractUUIDv4 from "~/routes/extractUUID"
import { EntityPageQuery } from "./EntityPageQuery"
const createStaticPathsGetter =
    (endpoint: string): GetStaticPaths<EntityPageQuery> =>
    async () => {
        const parameters: ListParameters<unknown> & Query = { page: "0" }
        const response = await fetchData<Page>(process.env.NEXT_PUBLIC_API_URL + endpoint + createSearch(parameters))
        if (!response.ok) {
            console.error(response)
            return {
                fallback: "blocking",
                paths: [],
            }
        }
        const paths: GetStaticPathsResult<EntityPageQuery>["paths"] =
            response.data._links.items
                .map(link => extractUUIDv4(link.href))
                .filter(isDefined)
                .map(uuid => ({
                    params: { uuid },
                })) ?? []
        return {
            fallback: "blocking",
            paths,
        }
    }
export default createStaticPathsGetter
