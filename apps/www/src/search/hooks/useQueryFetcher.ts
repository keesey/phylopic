import { NodeWithEmbedded, PageWithEmbedded } from "@phylopic/api-models"
import { useCallback } from "react"
import { Fetcher } from "swr"
import useAPIFetcher from "~/swr/api/useAPIFetcher"
export type QueryKey = Readonly<[string | null, string | undefined]>
export type QueryFetcherResult<T extends Readonly<{ build: number }>> = Readonly<[T, string | undefined]>
export type QueryFetcher<T extends Readonly<{ build: number }>> = Fetcher<QueryFetcherResult<T>, QueryKey>
const useQueryFetcher = <T extends Readonly<{ build: number }>>(): QueryFetcher<T> => {
    const apiFetcher = useAPIFetcher<T>()
    return useCallback<QueryFetcher<T>>(
        async (endpoint, basis) => {
            const apiResult = await apiFetcher(endpoint)
            return [apiResult, basis] as QueryFetcherResult<T>
        },
        [apiFetcher],
    )
}
export default useQueryFetcher
