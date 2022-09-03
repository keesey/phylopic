import { SearchContext, useExternalResolutions } from "@phylopic/ui"
import { Identifier } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useCallback, useContext, useMemo, useState } from "react"
import Entries from "./Entries"
import NoEntries from "./NoEntries"
import { SearchEntry } from "./SearchEntry"
export type Props = {
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const NodeSearch: FC<Props> = ({ onComplete }) => {
    const [{ nodeResults, text }, dispatch] = useContext(SearchContext) ?? [{}]
    const externalResolutions = useExternalResolutions()
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
            ...externalResolutions.map(
                resolution =>
                    ({
                        authority: resolution.authority,
                        image: resolution.node._embedded.primaryImage,
                        name: parseNomen(resolution.title),
                        namespace: resolution.namespace,
                        objectID: resolution.objectID,
                    } as SearchEntry),
            ),
        ]
    }, [externalResolutions, nodeResults])
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
