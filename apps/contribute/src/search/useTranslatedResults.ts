import { SearchEntry } from "./SearchEntry"
import useSWRImmutable from "swr/immutable"
import { useMemo } from "react"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { Identifier, UUID } from "@phylopic/utils"
import { Node } from "@phylopic/source-models"
import getIdentifier from "./getIdentifier"
const useTranslatedResults = (entries: readonly SearchEntry[]) => {
    const fetcher = useAuthorizedJSONFetcher<Record<Identifier, (Node & { uuid: UUID }) | null>>()
    const key = useMemo(
        () => (entries.length ? { data: entries, method: "POST", url: `/api/resolve` } : null),
        [entries],
    )
    const { data, error, isValidating } = useSWRImmutable(key, fetcher)
    const translated = useMemo(() => {
        if (data) {
            return entries.map<SearchEntry>(entry => {
                const identifier = getIdentifier(entry)
                const node = data[identifier]
                if (node) {
                    return { authority: "phylopic.org", name: node.names[0], namespace: "nodes", objectID: node.uuid }
                }
                return entry
            })
        }
    }, [data, entries])
    return {
        data: translated,
        error,
        isValidating,
    }
}
export default useTranslatedResults
