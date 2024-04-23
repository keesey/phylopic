import { NodeWithEmbedded } from "@phylopic/api-models"
import { ExternalResolution, SearchContext, useExternalResolutions } from "@phylopic/client-components"
import { Authority, Namespace, ObjectID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { useContext, useMemo } from "react"
import { SearchEntry } from "~/models/SearchEntry"
export const useEntries = () => {
    const [{ externalResults, nodeResults }] = useContext(SearchContext) ?? [{}]
    const externalResolutions = useExternalResolutions()
    const externalEntries = useExternalEntries(externalResults)
    const externalUnresolved = useUnresolved(externalEntries, externalResolutions)
    return useCombinedEntries(nodeResults, externalResolutions, externalUnresolved)
}
export default useEntries
const useExternalEntries = (
    externalResults:
        | Readonly<Record<Authority, Readonly<Record<Namespace, Readonly<Record<ObjectID, string>>>>>>
        | undefined,
): readonly SearchEntry[] => {
    return useMemo<readonly SearchEntry[]>(() => {
        if (!externalResults) {
            return []
        }
        const entries: SearchEntry[] = []
        for (const authority of Object.keys(externalResults) as Authority[]) {
            const authorityRecord = externalResults[authority]
            for (const namespace of Object.keys(authorityRecord) as Namespace[]) {
                const namespaceRecord = authorityRecord[namespace]
                for (const objectID of Object.keys(namespaceRecord) as ObjectID[]) {
                    const object = namespaceRecord[objectID]
                    entries.push({
                        authority,
                        name: parseNomen(object),
                        namespace,
                        objectID,
                    })
                }
            }
        }
        return entries
    }, [externalResults])
}
const convertResolutionToEntry = (resolution: ExternalResolution) =>
    ({
        authority: resolution.authority,
        image: resolution.node._embedded.primaryImage,
        name: parseNomen(resolution.title),
        namespace: resolution.namespace,
        objectID: resolution.objectID,
    }) as SearchEntry
const mapNodeResultsToEntries = (nodeResults: readonly NodeWithEmbedded[] | undefined): readonly SearchEntry[] => {
    return (nodeResults ?? []).map(
        node =>
            ({
                authority: "phylopic.org",
                image: node._embedded.primaryImage,
                name: node.names[0],
                namespace: "nodes",
                objectID: node.uuid,
            }) as SearchEntry,
    )
}
const useUnresolved = (
    entries: readonly SearchEntry[],
    resolutions: readonly ExternalResolution[],
): readonly SearchEntry[] => {
    return useMemo<readonly SearchEntry[]>(
        () =>
            entries.filter(
                entry =>
                    !resolutions.some(
                        resolution =>
                            resolution.authority === entry.authority &&
                            resolution.namespace === entry.namespace &&
                            resolution.objectID === entry.objectID,
                    ),
            ),
        [entries, resolutions],
    )
}

function useCombinedEntries(
    nodeResults: readonly NodeWithEmbedded[] | undefined,
    externalResolutions: ExternalResolution[],
    externalUnresolved: readonly SearchEntry[],
): readonly SearchEntry[] {
    return useMemo(() => {
        return [
            ...mapNodeResultsToEntries(nodeResults),
            ...externalResolutions
                .filter(value => !nodeResults || !nodeResults.some(node => node.uuid === value.uuid))
                .map(convertResolutionToEntry),
            ...externalUnresolved,
        ]
    }, [externalResolutions, externalUnresolved, nodeResults])
}
