import { useContext, useMemo } from "react"
import { Fetcher } from "swr"
import BuildContext from "~/builds/BuildContext"
import createAPIFetcher from "./createAPIFetcher"
const useAPIFetcher = <T extends Readonly<{ build: number }> = Readonly<{ build: number }>>(): Fetcher<T> => {
    const [, setBuild] = useContext(BuildContext) ?? []
    return useMemo(() => createAPIFetcher<T>(setBuild), [setBuild])
}
export default useAPIFetcher
