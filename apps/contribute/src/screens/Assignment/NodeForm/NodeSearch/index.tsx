import { Loader } from "@phylopic/ui"
import { Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useMemo } from "react"
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
    const searchText = useMemo(() => stringifyNomen(name), [name])
    const { data: entries, error, pending } = useSearch(searchText)
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
        return <NoEntries name={name} onCancel={onCancel} onComplete={onComplete} />
    }
    return <Entries entries={entries} name={name} onCancel={onCancel} onComplete={onComplete} />
}
export default NodeSearch
