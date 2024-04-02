import { compareStrings, isUUID, stringifyNomen, UUID } from "@phylopic/utils"
import { useContext, useMemo } from "react"
import { SearchContext } from "../context"
import { ExternalResolution } from "../models/ExternalResolution"
import { getSortIndex } from "../utils/getSortIndex"
const createResolutionComparator = (text: string) => (a: ExternalResolution, b: ExternalResolution) => {
    if (a === b) {
        return 0
    }
    return (
        getSortIndex(a.title, text) - getSortIndex(b.title, text) ||
        compareStrings(stringifyNomen(a.node.names[0]), stringifyNomen(b.node.names[0])) ||
        compareStrings(a.title, b.title) ||
        compareStrings(a.uuid, b.uuid)
    )
}
export const useExternalResolutions = (maxResults = Infinity) => {
    const [state] = useContext(SearchContext) ?? []
    const nodeResultUUIDs = useMemo(
        () => new Set((state?.nodeResults ?? []).slice(0, maxResults).map(nodeResult => nodeResult.uuid)),
        [maxResults, state?.nodeResults],
    )
    return useMemo(() => {
        const uuids = new Set<UUID>()
        const results: ExternalResolution[] = []
        const authorities = Object.keys(state?.externalResults ?? {}).sort(compareStrings)
        for (const authority of authorities) {
            const authorityResults = state?.externalResults[authority] ?? {}
            const namespaces = Object.keys(authorityResults).sort(compareStrings)
            for (const namespace of namespaces) {
                const namespaceResults = state?.externalResults[authority]?.[namespace] ?? {}
                const objectIDs = Object.keys(namespaceResults).sort(compareStrings)
                for (const objectID of objectIDs) {
                    const title = namespaceResults[objectID]
                    const uuid = state?.resolutions[authority]?.[namespace]?.[objectID]
                    if (isUUID(uuid) && typeof title === "string" && !uuids.has(uuid) && !nodeResultUUIDs.has(uuid)) {
                        const node = state?.resolvedNodes[uuid]
                        if (node) {
                            results.push({ authority, namespace, node, objectID, title, uuid })
                            uuids.add(uuid)
                        }
                    }
                }
            }
        }
        return results.sort(createResolutionComparator(state?.text ?? "")).slice(0, maxResults - nodeResultUUIDs.size)
    }, [maxResults, nodeResultUUIDs, state?.externalResults, state?.resolutions, state?.resolvedNodes, state?.text])
}
