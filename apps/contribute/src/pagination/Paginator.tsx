import { Page } from "@phylopic/source-client"
import { InfiniteScroll } from "@phylopic/ui"
import { createSearch } from "@phylopic/utils"
import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
export type Props = {
    children: (value: ReadonlyArray<unknown>, isValidating: boolean) => ReactNode
    endpoint: string
    hideControls?: boolean
    hideLoader?: boolean
    onError?: (error: Error) => void
}
const Paginator: FC<Props> = ({ children, endpoint, hideControls, hideLoader, onError }) => {
    const authorized = useAuthorized()
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: Page<unknown, number | string> | null) => {
            return authorized && (index === 0 || previousPageData?.next)
                ? endpoint + createSearch({ page: previousPageData?.next })
                : null
        },
        [authorized, endpoint],
    )
    const fetcher = useAuthorizedJSONFetcher<Page<unknown, number | string>>()
    const { data, error, isValidating, setSize, size } = useSWRInfinite(getKey, fetcher, {
        revalidateFirstPage: true,
    })
    const items = useMemo(
        () =>
            data
                ? data.reduce<ReadonlyArray<unknown>>(
                      (prev, page) => [...prev, ...(page.items ?? [])],
                      [],
                  )
                : [],
        [data],
    )
    const isLastPage = useMemo(() => Boolean(data?.length && data[data.length - 1].next === undefined), [data])
    const loadNextPage = useCallback(() => {
        if (!isLastPage) {
            setSize(size + 1)
        }
    }, [isLastPage, setSize, size])
    useEffect(() => {
        if (error) {
            onError?.(error)
        }
    }, [error, onError])
    return (
        <>
            <Fragment key="items">{children(items, isValidating)}</Fragment>
            {!isLastPage && !error && !hideControls && (
                <InfiniteScroll
                    hideLoader={hideLoader}
                    key="infinite-scroll"
                    onInViewport={loadNextPage}
                    pending={isValidating}
                />
            )}
            {error && !hideControls && (
                <section key="error">
                    <h2>Error!</h2>
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
export default Paginator
