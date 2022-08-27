import { Page } from "@phylopic/source-client"
import { InfiniteScroll } from "@phylopic/ui"
import { createSearch, UUID } from "@phylopic/utils"
import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import fetchJSON from "~/fetch/fetchJSON"
export type Props = {
    children: (value: ReadonlyArray<unknown>, isValidating: boolean) => ReactNode
    endpoint: string
    hideControls?: boolean
    hideLoader?: boolean
    onError?: (error: Error) => void
}
const Paginator: FC<Props> = ({ children, endpoint, hideControls, hideLoader, onError }) => {
    const getKey = useCallback<SWRInfiniteKeyLoader>((index, previousPageData: Page<{ uuid: UUID }, number> | null) => {
        return index === 0 || previousPageData?.next
            ? endpoint + createSearch({ page: previousPageData?.next ?? 0 })
            : null
    }, [])
    const { data, error, isValidating, setSize, size } = useSWRInfinite<Page<{ uuid: UUID }, number>>(
        getKey,
        fetchJSON,
        {
            revalidateFirstPage: true,
        },
    )
    const items = useMemo(
        () =>
            data
                ? data.reduce<ReadonlyArray<{ uuid: UUID }>>((prev, page) => [...prev, ...(page.items ?? [])], [])
                : [],
        [data],
    )
    const isLastPage = useMemo(() => Boolean(data?.length && !data[data.length - 1].next), [data])
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
                </section>
            )}
        </>
    )
}
export default Paginator
