import { List, PageWithEmbedded } from "@phylopic/api-models"
import { createSearch, Query, URL } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import React, { useEffect } from "react"
import useSWR, { BareFetcher, SWRConfiguration } from "swr"
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteFetcher, SWRInfiniteKeyLoader } from "swr/infinite"
import { InfiniteScroll } from "../../controls"
import { createPageKeyGetter } from "./createPageKeyGetter"
export type PaginationContainerProps<T> = {
    autoLoad?: boolean
    children: (value: readonly T[], total: number, isLoading: boolean) => React.ReactNode
    endpoint: URL
    hideControls?: boolean
    hideLoader?: boolean
    maxPages?: number
    onError?: (error: Error) => void
    onPage?: (index: number) => void
    query?: Query
    swrConfigs?: {
        list?: SWRConfiguration<List, Error, BareFetcher<List>>
        page?: SWRInfiniteConfiguration<
            PageWithEmbedded<T>,
            Error,
            SWRInfiniteFetcher<PageWithEmbedded<T>, SWRInfiniteKeyLoader>
        >
    }
}
const SWR_CONFIG = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
}
const SWR_INFINITE_CONFIG = {
    ...SWR_CONFIG,
    revalidateFirstPage: false,
}
export const PaginationContainer: React.FC<PaginationContainerProps<any>> = ({
    autoLoad,
    children,
    endpoint,
    hideControls,
    hideLoader,
    maxPages,
    onError,
    onPage,
    query,
    swrConfigs,
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
    const list = useSWR<List>(listKey, fetcher as BareFetcher<List>, { ...SWR_CONFIG, ...swrConfigs?.list })
    const getPageKey = React.useMemo(
        () =>
            list.data?.totalPages && build
                ? createPageKeyGetter(endpoint, { ...query, embed_items: true, build })
                : () => null,
        [build, endpoint, list.data, query],
    )
    const pages = useSWRInfinite(getPageKey, fetcher as BareFetcher<PageWithEmbedded<unknown>>, {
        ...SWR_INFINITE_CONFIG,
        ...swrConfigs?.page,
    })
    const { data, setSize, size } = pages
    useEffect(() => (pages.data ? onPage?.(pages.data.length) : undefined), [onPage, pages.data])
    const loadNextPage = () => setSize(size + 1)
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
    const moreToLoad = size < (maxPages ?? totalPages)
    React.useEffect(() => {
        if (autoLoad && moreToLoad && !error && !list.isValidating && !pages.isValidating) {
            loadNextPage()
        }
    }, [autoLoad, error, list.isValidating, loadNextPage, moreToLoad, pages.isValidating])
    return (
        <>
            <React.Fragment key="items">
                {children(items, totalItems, list.isLoading || pages.isLoading)}
            </React.Fragment>
            {moreToLoad && !error && !hideControls && (
                <InfiniteScroll
                    hideLoader={hideLoader}
                    key="infinite-scroll"
                    onInViewport={!autoLoad ? loadNextPage : undefined}
                    pending={list.isValidating || pages.isValidating}
                />
            )}
            {error && !hideControls && (
                <section key="error">
                    <p>
                        <strong>{String(error)}</strong>
                    </p>
                    <p>
                        (You may <a href="//github.com/keesey/phylopic/issues/new">report this issue</a>.)
                    </p>
                </section>
            )}
        </>
    )
}
