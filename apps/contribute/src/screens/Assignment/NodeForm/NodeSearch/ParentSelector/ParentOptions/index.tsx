import { getIdentifier } from "@phylopic/utils"
import { FC, useCallback } from "react"
import useComplete from "~/screens/Assignment/AssignmentContainer/hooks/useComplete"
import useNormalizedText from "~/screens/Assignment/AssignmentContainer/hooks/useNormalizedText"
import Speech from "~/ui/Speech"
import UserOptions from "~/ui/UserOptions"
import UserScrollTo from "~/ui/UserScrollTo"
import { SearchEntry } from "../../SearchEntry"
import EntryButton from "../../SearchOptions/EntryButton"
import useEntries from "../../useEntries"
export const ParentOptions: FC = () => {
    const childNameText = useNormalizedText()
    const entries = useEntries()
    const complete = useComplete()
    const handleEntryClick = useCallback(
        async (entry: SearchEntry) => {
            await complete(getIdentifier(entry.authority, entry.namespace, entry.objectID), childNameText)
        },
        [childNameText, complete],
    )
    return (
        <>
            <Speech mode="system">
                {entries.length === 0 && (
                    <p>
                        <strong>Tip:</strong> if nothing shows up, try an even more general group.
                    </p>
                )}
                {entries.length === 1 && <p>This one?</p>}
                {entries.length > 1 && <p>One of these?</p>}
            </Speech>
            <UserOptions>
                {entries.map(entry => (
                    <EntryButton
                        key={getIdentifier(entry.authority, entry.namespace, entry.objectID)}
                        onClick={() => handleEntryClick(entry)}
                        value={entry}
                    />
                ))}
            </UserOptions>
            <UserScrollTo />
        </>
    )
}
export default ParentOptions
