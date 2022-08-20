import { Loader } from "@phylopic/ui"
import { Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import useSearch from "~/search/useSearch"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import Entries from "./Entries"
import NoEntries from "./NoEntries"
export type Props = {
    name: Nomen
    onCancel: () => void
    onComplete: (uuid: UUID) => void
}
export const NodeSearch: FC<Props> = ({ name, onCancel, onComplete }) => {
    const [parentRequested, setParentRequested] = useState<boolean | null>(null)
    const searchText = useMemo(() => stringifyNomen(name), [name])
    const { data: entries, error, pending } = useSearch(searchText)
    const handleParentRequest = useCallback(() => setParentRequested(true), [])
    if (pending) {
        return (
            <Speech mode="system">
                <p>
                    Searching for <NameView value={name} />
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
                name={name}
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
            name={name}
            onCancel={onCancel}
            onComplete={onComplete}
            onParentRequest={handleParentRequest}
            parentRequested={parentRequested}
        />
    )
}
export default NodeSearch
