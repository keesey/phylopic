import { UUID } from "@phylopic/utils"
import { parseNomen } from "parse-nomen"
import { FC, useMemo, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import Speech from "~/ui/Speech"
import UserVerification from "~/ui/UserVerification"
import SearchOptions from "../SearchOptions"
import ParentSelector from "./ParentSelector"
import SearchSelector from "./SearchSelector"
export type Props = {
    entries: readonly SearchEntry[]
    nameText: string
    onCancel: () => void
    onComplete: (uuid: UUID) => void
    onParentRequest: () => void
    parentRequested: boolean | null
}
const Entries: FC<Props> = ({ entries, nameText, onCancel, onComplete, onParentRequest, parentRequested }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    const childName = useMemo(() => parseNomen(nameText), [nameText])
    return (
        <>
            <Speech mode="system">
                <p>{entries.length === 1 ? "Is this it?" : "Is it one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} onSelect={setSelected} />
            {selected && <SearchSelector entry={selected} onComplete={onComplete} />}
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
