import { FC, useCallback, useState } from "react"
import getIdentifier from "~/search/getIdentifier"
import { SearchEntry } from "~/search/SearchEntry"
import NameView from "~/ui/NameView"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import EntryButton from "./EntryButton"
export type Props = {
    entries: readonly SearchEntry[]
    includeNull: boolean
    onSelect: (value: SearchEntry | null) => void
}
const SearchOptions: FC<Props> = ({ entries, includeNull, onSelect }) => {
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
                        <EntryButton key={getIdentifier(entry)} onClick={() => select(entry)} value={entry} />
                    ))}
                </>
                {includeNull && (
                    <UserButton danger onClick={() => select(null)}>
                        No.
                    </UserButton>
                )}
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
