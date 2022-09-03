import { SearchContext } from "@phylopic/ui"
import { Identifier } from "@phylopic/utils"
import { FC, useCallback, useContext, useState } from "react"
import Entries from "./Entries"
import NoEntries from "./NoEntries"
import useEntries from "./useEntries"
export type Props = {
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const NodeSearch: FC<Props> = ({ onComplete }) => {
    const [{ text }, dispatch] = useContext(SearchContext) ?? [{}]
    const entries = useEntries()
    const [parentRequested, setParentRequested] = useState<boolean | null>(null)
    const handleParentRequest = useCallback(() => setParentRequested(true), [])
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
