import { UUID } from "@phylopic/api-models"
import { useContext, useMemo } from "react"
import compareStrings from "~/utils/compareStrings"
import SearchContext from "../context"
import { ExternalResolution } from "../models/ExternalResolution"
const useExternalResolutions = (maxResults = Infinity) => {
    const [state] = useContext(SearchContext) ?? []
    const nodeResults = useMemo(() => (state?.nodeResults ?? []).slice(0, maxResults), [maxResults, state?.nodeResults])
    return useMemo(() => {
        const results: ExternalResolution[] = []
        const uuids = new Set<UUID>()
        for (const authority of Object.keys(state?.externalResults ?? {}).sort(compareStrings)) {
            for (const namespace of Object.keys(state?.externalResults[authority] ?? {}).sort(compareStrings)) {
                for (const objectID of Object.keys(state?.externalResults[authority]?.[namespace] ?? {}).sort(
                    compareStrings,
                )) {
                    const title = state?.externalResults[authority]?.[namespace]?.[objectID]
                    const uuid = state?.resolutions[authority]?.[namespace]?.[objectID]
                    if (
                        typeof uuid === "string" &&
                        typeof title === "string" &&
                        !uuids.has(uuid) &&
                        nodeResults.every(node => uuid !== node.uuid)
                    ) {
                        const node = state?.resolvedNodes[uuid]
                        if (node) {
                            results.push({ authority, namespace, node, objectID, title, uuid })
                            uuids.add(uuid)
                        }
                    }
                }
            }
        }
        // :TODO: sort entries somehow?
        return results.slice(0, maxResults - nodeResults.length)
    }, [maxResults, nodeResults, state?.externalResults, state?.resolutions, state?.resolvedNodes])
}
export default useExternalResolutions
