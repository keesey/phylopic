import { List, Page } from "@phylopic/api-models"
import { createSearch } from "@phylopic/utils"
import { fetchData } from "@phylopic/utils-api"
import { GetStaticPaths, GetStaticPathsResult } from "next"
import slugify from "slugify"
import extractUUIDv4 from "~/routes/extractUUIDv4"
import getSlug from "~/routes/getSlug"
import { EntityPageQuery } from "./EntityPageQuery"
const isEntityPageQuery = (x: Partial<EntityPageQuery>): x is EntityPageQuery => Boolean(x?.uuid)
const createStaticPathsGetter =
    (endpoint: string): GetStaticPaths<EntityPageQuery> =>
    async () => {
        const listKey = process.env.NEXT_PUBLIC_API_URL + endpoint
        const listResponse = await fetchData<List>(listKey)
        if (!listResponse.ok || !listResponse.data.totalPages) {
            if (!listResponse.ok) {
                console.error(listKey, "=>", listResponse)
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
            console.error(pageKey, "=>", pageResponse)
            return {
                fallback: "blocking",
                paths: [],
            }
        }
        const paths: GetStaticPathsResult<EntityPageQuery>["paths"] =
            pageResponse.data._links.items
                .map(
                    link =>
                        ({
                            slug: getSlug(link.href, link.title),
                            uuid: extractUUIDv4(link.href) ?? undefined,
                        } as Partial<EntityPageQuery>),
                )
                .filter(isEntityPageQuery)
                .map((params: EntityPageQuery) => ({ params })) ?? []
        return {
            fallback: "blocking",
            paths,
        }
    }
export default createStaticPathsGetter
