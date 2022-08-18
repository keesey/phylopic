import { Node as APINode, PageWithEmbedded } from "@phylopic/api-models"
import { Page } from "@phylopic/source-client"
import { Node as SourceNode } from "@phylopic/source-models"
import { normalizeText, UUID } from "@phylopic/utils"
import { APISWRError, BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import { useContext, useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { SearchEntry } from "./SearchEntry"
const usePhyloPicResults = (text: string) => {
    const normalized = useMemo(() => normalizeText(text), [text])
    const apiFetcher = useAPIFetcher<PageWithEmbedded<APINode>>()
    const [build] = useContext(BuildContext) ?? []
    useSWR(`${process.env.NEXT_PUBLIC_API_URL}/`, apiFetcher)
    const liveKey = useMemo(
        () =>
            build && normalized
                ? `${process.env.NEXT_PUBLIC_API_URL}/nodes?build=${encodeURIComponent(
                      build,
                  )}&embed_items=true&filter_name=${encodeURIComponent(normalized.toLowerCase())}&page=0`
                : null,
        [build, normalized],
    )
    const live = useSWR(liveKey, apiFetcher)
    const sourceKey = useMemo(
        () => (normalized ? `/api/nodes?filter=${encodeURIComponent(normalized.toLowerCase())}` : null),
        [normalized],
    )
    const authorizedFetcher = useAuthorizedJSONFetcher<Page<SourceNode & { uuid: UUID }, number>>()
    const source = useSWR(sourceKey, authorizedFetcher)
    const liveIsEmpty = useMemo(() => live.error instanceof APISWRError && live.error.statusCode === 404, [live.error])
    console.debug(live.error)
    const liveEntries = useMemo(
        () =>
            live.data?._embedded.items?.map<SearchEntry>(item => ({
                authority: "phylopic.org",
                namespace: "nodes",
                objectID: item.uuid,
                name: item.names[0],
            })) ?? [],
        [live.data],
    )
    const sourceEntries = useMemo(
        () =>
            source.data?.items.map<SearchEntry>(item => ({
                authority: "phylopic.org",
                namespace: "nodes",
                objectID: item.uuid,
                name: item.names[0],
            })) ?? [],
        [source.data],
    )
    const entries = useMemo(() => {
        return [
            ...sourceEntries,
            ...liveEntries.filter(entry => sourceEntries.every(sourceEntry => sourceEntry.objectID !== entry.objectID)),
        ]
    }, [liveEntries, sourceEntries])
    const data = (live.data || liveIsEmpty) && source.data ? entries : undefined
    const error = (liveIsEmpty ? undefined : live.error) ?? source.error
    const isValidating = live.isValidating || source.isValidating
    return { data, error, isValidating }
}
export default usePhyloPicResults
