import { createSearch, Query, URL } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import React from "react"
import useSWRImmutable from "swr/immutable"
import { Loader } from "../../core"
export type DataContainerProps<T extends Readonly<{ build: number }> = Readonly<{ build: number }>> = {
    children?: (value?: T) => React.ReactNode
    endpoint: URL
    hideLoader?: boolean
    onError?: (error: Error) => void
    query?: Query
}
export const DataContainer: React.FC<DataContainerProps> = ({ children, endpoint, hideLoader, onError, query }) => {
    const [build] = React.useContext(BuildContext) ?? []
    const fetcher = useAPIFetcher()
    const queryWithBuild = React.useMemo(() => (build ? { ...query, build } : query ?? {}), [build, query])
    const key = React.useMemo(() => endpoint + createSearch(queryWithBuild), [endpoint, queryWithBuild])
    const { data, error, isValidating } = useSWRImmutable(key, fetcher)
    React.useEffect(() => {
        if (error) {
            onError?.(error)
        }
    }, [error, onError])
    return (
        <>
            <React.Fragment key="items">{children?.(data)}</React.Fragment>
            {!data && isValidating && !hideLoader && <Loader />}
            {error && (
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
