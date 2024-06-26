import { useContext, useMemo } from "react"
import type { BareFetcher } from "swr"
import { BuildContext } from "../builds"
import { createAPIFetcher } from "./createAPIFetcher"
export const useAPIFetcher = <
    T extends Readonly<{ build: number }> = Readonly<{ build: number }>,
>(): BareFetcher<T> => {
    const [build, setBuild] = useContext(BuildContext) ?? []
    return useMemo(() => createAPIFetcher<T>(build, setBuild), [build, setBuild])
}
