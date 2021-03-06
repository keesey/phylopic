import { useContext, useMemo } from "react"
import type { Fetcher } from "swr"
import { BuildContext } from "../builds"
import createAPIFetcher from "./createAPIFetcher"
export const useAPIFetcher = <T extends Readonly<{ build: number }> = Readonly<{ build: number }>>(): Fetcher<T> => {
    const [, setBuild] = useContext(BuildContext) ?? []
    return useMemo(() => createAPIFetcher<T>(setBuild), [setBuild])
}
export default useAPIFetcher
