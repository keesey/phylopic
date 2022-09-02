import { Loader } from "@phylopic/ui"
import { Identifier } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import useSearch from "~/search/useSearch"
import Speech from "~/ui/Speech"
import NameRenderer from "../NameRenderer"
import Entries from "./Entries"
import NoEntries from "./NoEntries"
export type Props = {
    nameText: string
    onCancel: () => void
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const NodeSearch: FC<Props> = ({ nameText, onCancel, onComplete }) => {
    const [parentRequested, setParentRequested] = useState<boolean | null>(null)
    const { data: entries, error, pending } = useSearch(nameText)
    const handleParentRequest = useCallback(() => setParentRequested(true), [])
    if (pending) {
        return (
            <Speech mode="system">
                <p>
                    Searching for <NameRenderer value={nameText} />
                    &hellip;
                </p>
                <Loader />
            </Speech>
        )
    }
    if (error) {
        return (
            <Speech mode="system">
                <p>Whoops! Had some trouble.</p>
                <p>&ldquo;{String(error)}&rdquo;</p>
            </Speech>
        )
    }
    if (entries.length === 0) {
        return (
            <NoEntries
                key="noEntries"
                nameText={nameText}
                onCancel={onCancel}
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
            nameText={nameText}
            onCancel={onCancel}
            onComplete={onComplete}
            onParentRequest={handleParentRequest}
            parentRequested={parentRequested}
        />
    )
}
export default NodeSearch
