import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import Speech from "~/ui/Speech"
import UserVerification from "../../../../ui/UserVerification"
import SearchOptions from "../SearchOptions"
import ParentSelector from "./ParentSelector"
import SearchSelector from "./SearchSelector"
export type Props = {
    entries: readonly SearchEntry[]
    name: Nomen
    onCancel: () => void
    onComplete: (uuid: UUID) => void
    onParentRequest: () => void
    parentRequested: boolean | null
}
const Entries: FC<Props> = ({ entries, name, onCancel, onComplete, onParentRequest, parentRequested }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    return (
        <>
            <Speech mode="system">
                <p>{entries.length === 1 ? "Is this it?" : "Is it one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} includeNull={true} onSelect={setSelected} />
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
                    {parentRequested && <ParentSelector childName={name} onComplete={onComplete} />}
                </>
            )}
        </>
    )
}
export default Entries
