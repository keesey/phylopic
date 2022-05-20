import { List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query, URL } from "@phylopic/utils"
import { FC, Fragment, ReactNode, useCallback, useContext, useEffect, useMemo } from "react"
import { BareFetcher } from "swr"
import useSWRImmutable from "swr/immutable"
import useSWRInfinite from "swr/infinite"
import BuildContext from "~/builds/BuildContext"
import useAPIFetcher from "../api/useAPIFetcher"
import createPageKeyGetter from "./createPageKeyGetter"
import InfiniteScroll from "./InfiniteScroll"
export type Props<T = unknown> = {
    children: (value: readonly T[], total: number) => ReactNode
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
const PaginationContainer: FC<Props> = ({ children, endpoint, hideControls, hideLoader, maxPages, onError, query }) => {
    const [build] = useContext(BuildContext) ?? []
    const fetcher = useAPIFetcher<List | PageWithEmbedded<unknown>>()
    const queryWithoutEmbeds = useMemo(
        () =>
            Object.entries(query ?? {})
                .filter(([key]) => !key.startsWith("embed_"))
                .reduce<Query>((prev, [key, value]) => ({ ...prev, [key]: value }), {}),
        [query],
    )
    const listQuery = useMemo(
        () => (build ? { ...queryWithoutEmbeds, build } : queryWithoutEmbeds),
        [build, queryWithoutEmbeds],
    )
    const listKey = useMemo(() => endpoint + createSearch(listQuery), [endpoint, listQuery])
    const list = useSWRImmutable<List>(listKey, fetcher as BareFetcher<List>)
    const getPageKey = useMemo(
        () =>
            list.data?.totalPages ? createPageKeyGetter(endpoint, { ...query, embed_items: true, build }) : () => null,
        [build, endpoint, list.data, query],
    )
    const pages = useSWRInfinite(getPageKey, fetcher as BareFetcher<PageWithEmbedded<unknown>>, SWR_INFINITE_CONFIG)
    const { data, setSize, size } = pages
    const loadNextPage = useCallback(() => setSize(size + 1), [setSize, size])
    const totalItems = list.data?.totalItems ?? NaN
    const totalPages = list.data?.totalPages ?? NaN
    const displayedPages = useMemo(
        () => (typeof maxPages === "number" ? data?.slice(0, maxPages) : data),
        [data, maxPages],
    )
    const items = useMemo(
        () =>
            displayedPages
                ? displayedPages.reduce<unknown[]>((prev, page) => [...prev, ...(page._embedded?.items ?? [])], [])
                : [],
        [displayedPages],
    )
    const error = list.error ?? pages.error
    useEffect(() => {
        if (error) {
            onError?.(error)
        }
    }, [error, onError])
    return (
        <>
            <Fragment key="items">{children(items, totalItems)}</Fragment>
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
export default PaginationContainer
