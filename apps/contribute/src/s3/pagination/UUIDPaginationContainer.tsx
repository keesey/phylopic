import { InfiniteScroll } from "@phylopic/ui"
import { URL, UUID } from "@phylopic/utils"
import React, { Fragment, useCallback, useEffect, useMemo } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { UUIDList } from "../models/UUIDList"
export type Props = {
    children: (value: readonly UUID[], isValidating: boolean) => React.ReactNode
    endpoint: URL
    hideControls?: boolean
    hideLoader?: boolean
    maxItems?: number
    onError?: (error: Error) => void
}
const UUIDPaginationContainer: React.FC<Props> = ({
    children,
    endpoint,
    hideControls,
    hideLoader,
    maxItems,
    onError,
}) => {
    const authorized = useAuthorized()
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: UUIDList | null) =>
            authorized && (index === 0 || previousPageData?.uuids.length)
                ? endpoint +
                  (previousPageData?.nextToken ? `?token=${encodeURIComponent(previousPageData.nextToken)}` : "")
                : null,
        [authorized],
    )
    const fetcher = useAuthorizedJSONFetcher<UUIDList>()
    const { data, error, isValidating, setSize, size } = useSWRInfinite<UUIDList>(getKey, fetcher)
    const uuids = useMemo(
        () => (data ? data.reduce<readonly UUID[]>((prev, page) => [...prev, ...(page.uuids ?? [])], []) : []),
        [data],
    )
    const displayedUUIDs = useMemo(() => (maxItems ? uuids.slice(0, maxItems) : uuids), [uuids, maxItems])
    const isLastPage = useMemo(
        () =>
            Boolean(data?.length && !data[data.length - 1].nextToken) || Boolean(maxItems && uuids.length >= maxItems),
        [data],
    )
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
            <Fragment key="items">{children(displayedUUIDs, isValidating)}</Fragment>
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
export default UUIDPaginationContainer
