import { Page } from "@phylopic/source-client"
import { Image } from "@phylopic/source-models"
import { InfiniteScroll } from "@phylopic/ui"
import { createSearch, UUID } from "@phylopic/utils"
import { FC, Fragment, ReactNode, useCallback, useEffect, useMemo } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { ImageFilter } from "./ImageFilter"
export type Props = {
    children: (value: ReadonlyArray<Image & { uuid: UUID }>, isValidating: boolean) => ReactNode
    filter: ImageFilter
    hideControls?: boolean
    hideLoader?: boolean
    onError?: (error: Error) => void
}
const ImagePaginator: FC<Props> = ({ children, filter, hideControls, hideLoader, onError }) => {
    const authorized = useAuthorized()
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: Page<Image & { uuid: UUID }, number> | null) => {
            return authorized && (index === 0 || previousPageData?.next)
                ? "/api/images" + createSearch({ filter, page: previousPageData?.next ?? 0 })
                : null
        },
        [authorized, filter],
    )
    const fetcher = useAuthorizedJSONFetcher<Page<Image & { uuid: UUID }, number>>()
    const { data, error, isValidating, setSize, size } = useSWRInfinite(getKey, fetcher, {
        revalidateFirstPage: true
    })
    const items = useMemo(
        () =>
            data
                ? data.reduce<ReadonlyArray<Image & { uuid: UUID }>>(
                      (prev, page) => [...prev, ...(page.items ?? [])],
                      [],
                  )
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
                    <p>
                        (You may <a href="https://github.com/keesey/phylopic/issues/new">report this issue</a>.)
                    </p>
                </section>
            )}
        </>
    )
}
export default ImagePaginator
