import { List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query } from "@phylopic/utils"
import { addBuildToURL, fetchData, fetchResult } from "@phylopic/utils-api"
import type { GetStaticProps } from "next"
import { unstable_serialize } from "swr"
import { PublicConfiguration } from "swr/dist/types"
import { unstable_serialize as unstable_serialize_infinite } from "swr/infinite"
import getStaticPropsResult from "~/fetch/getStaticPropsResult"
export type Props = {
    fallback: PublicConfiguration["fallback"]
} & Pick<List, "build">
const createListStaticPropsGetter =
    <TEntity>(endpoint: string, query?: Query): GetStaticProps<Props, Record<string, never>> =>
    async () => {
        const listKey = process.env.NEXT_PUBLIC_API_URL + endpoint
        const listResponse = await fetchResult<List>(listKey)
        if (listResponse.status !== "success") {
            return getStaticPropsResult(listResponse)
        }
        const build = listResponse.data.build
        const props: Props = {
            build,
            fallback: {
                [unstable_serialize(addBuildToURL(listKey, build))]: listResponse.data,
            },
        }
        if (listResponse.data.totalPages > 0) {
            const getPageKey = (page: number) =>
                listKey +
                createSearch({
                    ...query,
                    build,
                    embed_items: true,
                    page,
                })
            const pageResponse = await fetchData<PageWithEmbedded<TEntity>>(getPageKey(0))
            if (pageResponse.ok) {
                props.fallback[unstable_serialize_infinite(getPageKey)] = [pageResponse.data]
            }
        }
        return { props }
    }
export default createListStaticPropsGetter
