import { useAPIFetcher } from "@phylopic/utils-api"
import { useCallback } from "react"
import type { Fetcher } from "swr"
export type QueryKey = Readonly<[string | null, string | undefined]>
export type QueryFetcherResult<T extends Readonly<{ build: number }>> = Readonly<[T, string | undefined]>
export type QueryFetcher<T extends Readonly<{ build: number }>> = Fetcher<QueryFetcherResult<T>, QueryKey>
export const useQueryFetcher = <T extends Readonly<{ build: number }>>(): QueryFetcher<T> => {
    const apiFetcher = useAPIFetcher<T>()
    return useCallback<QueryFetcher<T>>(
        async ([endpoint, basis]) => {
            const apiResult = await apiFetcher(endpoint)
            return [apiResult, basis] as QueryFetcherResult<T>
        },
        [apiFetcher],
    )
}
