import { Node as APINode, PageWithEmbedded } from "@phylopic/api-models"
import { Page } from "@phylopic/source-client"
import { Node as SourceNode } from "@phylopic/source-models"
import { normalizeText, UUID } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import { useContext, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import isNotFoundError from "~/http/isNotFoundError"
import isServerError from "~/http/isServerError"
import { SearchEntry } from "./SearchEntry"
const usePhyloPicResults = (text: string) => {
    const normalized = useMemo(() => normalizeText(text), [text])
    const [build] = useContext(BuildContext) ?? []
    const apiFetcher = useAPIFetcher<PageWithEmbedded<APINode>>()
    useSWRImmutable(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/`, apiFetcher, {
        shouldRetryOnError: true,
    })
    const liveKey = useMemo(
        () =>
            build && normalized
                ? `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/nodes?build=${encodeURIComponent(
                      build,
                  )}&embed_items=true&filter_name=${encodeURIComponent(normalized.toLowerCase())}&page=0`
                : null,
        [build, normalized],
    )
    const live = useSWRImmutable(liveKey, apiFetcher, {
        shouldRetryOnError: isServerError,
    })
    const sourceKey = useMemo(
        () => (normalized ? `/api/nodes?filter=${encodeURIComponent(normalized.toLowerCase())}` : null),
        [normalized],
    )
    const authorizedFetcher = useAuthorizedJSONFetcher<Page<SourceNode & { uuid: UUID }, number>>()
    const source = useSWRImmutable(sourceKey, authorizedFetcher)
    const liveIsEmpty = useMemo(() => isNotFoundError(live.error), [live.error])
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
