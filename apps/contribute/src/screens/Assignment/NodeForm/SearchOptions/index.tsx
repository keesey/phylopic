import { getIdentifier } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import { ICON_X } from "~/ui/ICON_SYMBOLS"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import { SearchEntry } from "../NodeSearch/SearchEntry"
import EntryButton from "./EntryButton"
export type Props = {
    entries: readonly SearchEntry[]
    onSelect: (value: SearchEntry | null) => void
}
const SearchOptions: FC<Props> = ({ entries, onSelect }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    const select = useCallback(
        (value: SearchEntry | null) => {
            setSelected(value)
            onSelect(value)
        },
        [onSelect],
    )
    if (!entries.length) {
        return null
    }
    if (selected === undefined) {
        return (
            <UserOptions>
                <>
                    {entries.map(entry => (
                        <EntryButton
                            key={getIdentifier(entry.authority, entry.namespace, entry.objectID)}
                            onClick={() => select(entry)}
                            value={entry}
                        />
                    ))}
                </>
                <UserButton danger icon={ICON_X} onClick={() => select(null)}>
                    No.
                </UserButton>
            </UserOptions>
        )
    }
    if (selected === null) {
        return <Speech mode="user">No.</Speech>
    }
    return (
        <Speech mode="user">
            <NameView value={selected.name} />
        </Speech>
    )
}
export default SearchOptions
