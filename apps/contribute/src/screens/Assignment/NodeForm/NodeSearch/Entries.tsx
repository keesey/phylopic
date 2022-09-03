import { Loader } from "@phylopic/ui"
import { getIdentifier, Identifier } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useCallback, useMemo, useState } from "react"
import Speech from "~/ui/Speech"
import UserVerification from "~/ui/UserVerification"
import SearchOptions from "../SearchOptions"
import ParentSelector from "./ParentSelector"
import { SearchEntry } from "./SearchEntry"
export type Props = {
    entries: readonly SearchEntry[]
    nameText: string
    onCancel: () => void
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
    onParentRequest: () => void
    parentRequested: boolean | null
}
const Entries: FC<Props> = ({ entries, nameText, onCancel, onComplete, onParentRequest, parentRequested }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    const childName = useMemo(() => parseNomen(nameText), [nameText])
    const handleSelect = useCallback(
        (entry: SearchEntry | null) => {
            setSelected(entry)
            if (entry) {
                onComplete(getIdentifier(entry.authority, entry.namespace, entry.objectID), null)
            }
        },
        [onComplete],
    )
    return (
        <>
            <Speech mode="system">
                <p>{entries.length === 1 ? "Is this it?" : "Is it one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} onSelect={handleSelect} />
            {selected && (
                <Speech mode="system">
                    <p>One moment&hellip;</p>
                    <Loader />
                </Speech>
            )}
            {selected === null && (
                <>
                    <Speech mode="system">
                        <p>But you spelled it right?</p>
                    </Speech>
                    <UserVerification
                        affirmed={parentRequested}
                        affirmation="Yes, I did."
                        denial={<>Uh, maybe not.</>}
                        onAffirm={onParentRequest}
                        onDeny={onCancel}
                    />
                    {parentRequested && <ParentSelector childName={childName} onComplete={onComplete} />}
                </>
            )}
        </>
    )
}
export default Entries
