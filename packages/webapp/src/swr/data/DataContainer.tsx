import { createSearch, Query, URL } from "@phylopic/utils"
import { FC, Fragment, ReactNode, useContext, useEffect, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import BuildContext from "~/builds/BuildContext"
import Loader from "~/ui/Loader"
import useAPIFetcher from "../api/useAPIFetcher"
export type Props<T extends Readonly<{ build: number }> = Readonly<{ build: number }>> = {
    children?: (value?: T) => ReactNode
    endpoint: URL
    hideLoader?: boolean
    onError?: (error: Error) => void
    query?: Query
}
const DataContainer: FC<Props> = ({ children, endpoint, hideLoader, onError, query }) => {
    const [build] = useContext(BuildContext) ?? []
    const fetcher = useAPIFetcher()
    const queryWithBuild = useMemo(() => ({ ...query, build }), [build, query])
    const key = useMemo(() => endpoint + createSearch(queryWithBuild), [endpoint, queryWithBuild])
    const { data, error, isValidating } = useSWRImmutable(key, fetcher)
    useEffect(() => {
        if (error) {
            onError?.(error)
        }
    }, [error, onError])
    return (
        <>
            <Fragment key="items">{children?.(data)}</Fragment>
            {!data && isValidating && !hideLoader && <Loader />}
            {error && (
                <p key="error">
                    <strong>{String(error)}</strong>
                </p>
            )}
        </>
    )
}
export default DataContainer
