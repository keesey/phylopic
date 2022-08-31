import { Node as APINode, Node, PageWithEmbedded } from "@phylopic/api-models"
import { normalizeText } from "@phylopic/utils"
import { BuildContext, useAPIFetcher } from "@phylopic/utils-api"
import { useContext, useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import isServerError from "~/http/isServerError"
import { SearchEntry } from "./SearchEntry"
const usePhyloPicResults = (text: string) => {
    const normalized = useMemo(() => normalizeText(text), [text])
    const [build] = useContext(BuildContext) ?? []
    const apiFetcher = useAPIFetcher<PageWithEmbedded<APINode>>()
    useSWRImmutable(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/`, apiFetcher, {
        shouldRetryOnError: true,
    })
    const key = useMemo(
        () =>
            build && normalized
                ? `https://${process.env.NEXT_PUBLIC_API_DOMAIN}/nodes?build=${encodeURIComponent(
                      build,
                  )}&embed_items=true&filter_name=${encodeURIComponent(normalized.toLowerCase())}&page=0`
                : null,
        [build, normalized],
    )
    const { data, error, isValidating } = useSWRImmutable<PageWithEmbedded<Node>>(key, apiFetcher, {
        shouldRetryOnError: isServerError,
    })
    const entries = useMemo(
        () =>
            data?._embedded.items?.map<SearchEntry>(item => ({
                authority: "phylopic.org",
                namespace: "nodes",
                objectID: item.uuid,
                name: item.names[0],
            })) ?? [],
        [data],
    )
    return {
        data: data ? entries : undefined,
        error,
        isValidating,
    }
}
export default usePhyloPicResults
