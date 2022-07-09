import { List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query, URL } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import React from "react"
import { BareFetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import { InfiniteScroll } from "../../controls"
import { createPageKeyGetter } from "./createPageKeyGetter"
export type PaginationContainerProps<T = unknown> = {
    children: (value: readonly T[], total: number) => React.ReactNode
    endpoint: URL
    hideControls?: boolean
    hideLoader?: boolean
    maxPages?: number
    onError?: (error: Error) => void
    query?: Query
}
const SWR_INFINITE_CONFIG = {
    revalidateFirstPage: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}
export const PaginationContainer: React.FC<PaginationContainerProps> = ({
    children,
    endpoint,
    hideControls,
    hideLoader,
    maxPages,
    onError,
    query,
}) => {
    const [build] = React.useContext(BuildContext) ?? []
    const fetcher = useAPIFetcher<List | PageWithEmbedded<unknown>>()
    const queryWithoutEmbeds = React.useMemo(
        () =>
            Object.entries(query ?? {})
                .filter(([key]) => !key.startsWith("embed_"))
                .reduce<Query>((prev, [key, value]) => ({ ...prev, [key]: value }), {}),
        [query],
    )
    const listQuery = React.useMemo(
        () => (build ? { ...queryWithoutEmbeds, build } : queryWithoutEmbeds),
        [build, queryWithoutEmbeds],
    )
    const listKey = React.useMemo(() => endpoint + createSearch(listQuery), [endpoint, listQuery])
    const list = useSWRImmutable<List>(listKey, fetcher as BareFetcher<List>)
    const getPageKey = React.useMemo(
        () =>
            list.data?.totalPages ? createPageKeyGetter(endpoint, { ...query, embed_items: true, build }) : () => null,
        [build, endpoint, list.data, query],
    )
    const pages = useSWRInfinite(getPageKey, fetcher as BareFetcher<PageWithEmbedded<unknown>>, SWR_INFINITE_CONFIG)
    const { data, setSize, size } = pages
    const loadNextPage = React.useCallback(() => setSize(size + 1), [setSize, size])
    const totalItems = list.data?.totalItems ?? NaN
    const totalPages = list.data?.totalPages ?? NaN
    const displayedPages = React.useMemo(
        () => (typeof maxPages === "number" ? data?.slice(0, maxPages) : data),
        [data, maxPages],
    )
    const items = React.useMemo(
        () =>
            displayedPages
                ? displayedPages.reduce<unknown[]>((prev, page) => [...prev, ...(page._embedded?.items ?? [])], [])
                : [],
        [displayedPages],
    )
    const error = list.error ?? pages.error
    React.useEffect(() => {
        if (error) {
            onError?.(error)
        }
    }, [error, onError])
    return (
        <>
            <React.Fragment key="items">{children(items, totalItems)}</React.Fragment>
            {size < (maxPages ?? totalPages) && !error && !hideControls && (
                <InfiniteScroll
                    hideLoader={hideLoader}
                    key="infinite-scroll"
                    onInViewport={loadNextPage}
                    pending={list.isValidating || pages.isValidating}
                />
            )}
            {error && !hideControls && (
                <section key="error">
                    <p>
                        <strong>{String(error)}</strong>
                    </p>
                    <p>
                        (You may <a href="https://github.com/keesey/phylopic/issues/new">report this issue</a>.)
                    </p>
                </section>
            )}
        </>
    )
}
