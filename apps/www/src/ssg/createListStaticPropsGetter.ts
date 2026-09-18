import type { List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, type Query } from "@phylopic/utils"
import { fetchData, fetchResult } from "@phylopic/utils-api"
import type { Compressed } from "compress-json"
import type { GetStaticProps } from "next"
import type { SWRConfiguration } from "swr"
import { unstable_serialize } from "swr"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import BUILD from "~/build/BUILD"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
import compressFallback from "~/swr/compressFallback"
export type Props = {
    fallback: Compressed
}
const createListStaticPropsGetter =
    <TEntity>(endpoint: string, query?: Query): GetStaticProps<Props, Record<string, never>> =>
    async () => {
        const listKey = process.env.NEXT_PUBLIC_API_URL + endpoint + createSearch({ build: BUILD })
        const listResponse = await fetchResult<List>(listKey)
        if (listResponse.status !== "success") {
            return getStaticPropsResult(listResponse)
        }
        const fallback: NonNullable<SWRConfiguration["fallback"]> = {
            [unstable_serialize(listKey)]: listResponse.data,
        }
        if (listResponse.data.totalPages > 0) {
            const getPageKey = (page: number) =>
                process.env.NEXT_PUBLIC_API_URL +
                endpoint +
                createSearch({
                    ...query,
                    build: BUILD,
                    embed_items: true,
                    page,
                })
            const pageResponse = await fetchData<PageWithEmbedded<TEntity>>(getPageKey(0))
            if (pageResponse.ok) {
                fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
        return {
            props: {
                fallback: compressFallback(fallback),
            },
        }
    }
export default createListStaticPropsGetter
