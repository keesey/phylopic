import { List, Page } from "@phylopic/api-models"
import { createSearch, isDefined } from "@phylopic/utils"
import { GetStaticPaths, GetStaticPathsResult } from "next"
import fetchData from "~/fetch/fetchData"
import extractUUIDv4 from "~/routes/extractUUID"
import { EntityPageQuery } from "./EntityPageQuery"
const createStaticPathsGetter =
    (endpoint: string): GetStaticPaths<EntityPageQuery> =>
    async () => {
        const listKey = process.env.NEXT_PUBLIC_API_URL + endpoint
        const listResponse = await fetchData<List>(listKey)
        if (!listResponse.ok || !listResponse.data.totalPages) {
            if (!listResponse.ok) {
                console.error(listResponse)
            }
            return {
                fallback: "blocking",
                paths: [],
            }
        }
        const build = listResponse.data.build
        const pageKey = listKey + createSearch({ build, page: 0 })
        const pageResponse = await fetchData<Page>(pageKey)
        if (!pageResponse.ok) {
            console.error(pageResponse)
            return {
                fallback: "blocking",
                paths: [],
            }
        }
        const paths: GetStaticPathsResult<EntityPageQuery>["paths"] =
            pageResponse.data._links.items
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
