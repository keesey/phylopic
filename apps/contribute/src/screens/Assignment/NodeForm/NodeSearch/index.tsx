import { SearchContext, useExternalResolutions } from "@phylopic/ui"
import { Authority, Identifier, Namespace, ObjectID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useCallback, useContext, useMemo, useState } from "react"
import Entries from "./Entries"
import NoEntries from "./NoEntries"
import { SearchEntry } from "./SearchEntry"
export type Props = {
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const NodeSearch: FC<Props> = ({ onComplete }) => {
    const [{ externalResults, nodeResults, text }, dispatch] = useContext(SearchContext) ?? [{}]
    const externalResolutions = useExternalResolutions()
    const externalEntries = useMemo<readonly SearchEntry[]>(() => {
        if (!externalResults) {
            return []
        }
        const entries: SearchEntry[] = []
        for (const authority of Object.keys(externalResults) as Authority[]) {
            const authorityRecord = externalResults[authority]
            for (const namespace of Object.keys(authorityRecord) as Namespace[]) {
                const namspaceRecord = authorityRecord[namespace]
                for (const objectID of Object.keys(namspaceRecord) as ObjectID[]) {
                    const object = namspaceRecord[objectID]
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
    const externalUnresolved = useMemo<readonly SearchEntry[]>(
        () =>
            externalEntries.filter(
                entry =>
                    !externalResolutions.some(
                        resolution =>
                            resolution.authority === entry.authority &&
                            resolution.namespace === entry.namespace &&
                            resolution.objectID === entry.objectID,
                    ),
            ),
        [externalEntries, externalResolutions],
    )
    const [parentRequested, setParentRequested] = useState<boolean | null>(null)
    const handleParentRequest = useCallback(() => setParentRequested(true), [])
    const entries = useMemo(() => {
        return [
            ...(nodeResults ?? []).map(
                node =>
                    ({
                        authority: "phylopic.org",
                        image: node._embedded.primaryImage,
                        name: node.names[0],
                        namespace: "nodes",
                        objectID: node.uuid,
                    } as SearchEntry),
            ),
            ...externalResolutions
                .filter(value => !nodeResults || !nodeResults.some(node => node.uuid === value.uuid))
                .map(
                    resolution =>
                        ({
                            authority: resolution.authority,
                            image: resolution.node._embedded.primaryImage,
                            name: parseNomen(resolution.title),
                            namespace: resolution.namespace,
                            objectID: resolution.objectID,
                        } as SearchEntry),
                ),
            ...externalUnresolved,
        ]
    }, [externalResolutions, externalUnresolved, nodeResults])
    const handleCancel = useCallback(() => dispatch?.({ type: "SET_TEXT", payload: "" }), [dispatch])
    if (!text) {
        return null
    }
    if (!entries.length) {
        return (
            <NoEntries
                key="noEntries"
                nameText={text}
                onCancel={handleCancel}
                onComplete={onComplete}
                onParentRequest={handleParentRequest}
                parentRequested={parentRequested}
            />
        )
    }
    return (
        <Entries
            entries={entries}
            key="entries"
            nameText={text}
            onCancel={handleCancel}
            onComplete={onComplete}
            onParentRequest={handleParentRequest}
            parentRequested={parentRequested}
        />
    )
}
export default NodeSearch
