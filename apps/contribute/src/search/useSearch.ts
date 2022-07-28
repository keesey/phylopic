import { Node, PageWithEmbedded } from "@phylopic/api-models"
import { Identifier, Nomen } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import { parseNomen } from "parse-nomen"
import { useContext, useMemo } from "react"
import useSWR from "swr"
import fetchJSON from "~/swr/fetchJSON"
import useAsyncMemo from "~/utils/useAsyncMemo"
import useEOLResults from "./useEOLResults"
import useOTOLResults from "./useOTOLResults"
export interface SearchEntry {
    readonly identifier: Identifier
    readonly name: Nomen
}
const useSearch = (text: string) => {
    const [build] = useContext(BuildContext) ?? []
    const apiFetcher = useAPIFetcher()
    useSWR(`${process.env.NEXT_PUBLIC_API_URL}`, apiFetcher) // get build
    const phyloPicKey = useMemo(
        () =>
            text && build
                ? `${process.env.NEXT_PUBLIC_API_URL}/nodes?build=${encodeURIComponent(
                      build,
                  )}&embed_items=true&filter_name=${encodeURIComponent(text)}&page=0`
                : null,
        [text],
    )
    const phyloPic = useSWR<PageWithEmbedded<Node>>(phyloPicKey, fetchJSON)
    const otol = useOTOLResults(text)
    const eol = useEOLResults(text)
    const phyloPicEntries = useMemo(
        () =>
            phyloPic.data?._embedded.items?.map<SearchEntry>(item => ({
                identifier: `phylopic.org/nodes/${encodeURIComponent(item.uuid)}`,
                name: item.names[0],
            })) ?? [],
        [phyloPic.data],
    )
    const otolEntries = useMemo(
        () =>
            otol.data?.map<SearchEntry>(name => ({
                identifier: `opentreeoflife.org/taxonomy/${encodeURIComponent(name.ott_id.toString(10))}`,
                name: parseNomen(name.unique_name),
            })) ?? [],
        [otol.data],
    )
    const eolEntries = useMemo(
        () =>
            eol.data?.results.map<SearchEntry>(result => ({
                identifier: `eol.org/pages/${encodeURIComponent(result.id.toString(10))}`,
                name: parseNomen(result.title),
            })) ?? [],
        [eol.data],
    )
    const entry = useMemo<SearchEntry | undefined>(
        () => [...phyloPicEntries, ...otolEntries, ...eolEntries][0],
        [eolEntries, otolEntries, phyloPicEntries],
    )
    const data = Boolean(phyloPic.data && otol.data && eol.data)
    const error = phyloPic.error || otol.error || eol.error
    return useAsyncMemo(
        entry,
        error,
        !data && !error && (phyloPic.isValidating || otol.isValidating || eol.isValidating),
    )
}
export default useSearch
