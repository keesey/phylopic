import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import Speech from "~/ui/Speech"
import ParentSelector from "./ParentSelector"
import SearchOptions from "../SearchOptions"
import SearchSelector from "./SearchSelector"
import UserVerification from "../../../../ui/UserVerification"
export type Props = {
    entries: readonly SearchEntry[]
    name: Nomen
    onCancel: () => void
    onComplete: (uuid: UUID) => void
}
const Entries: FC<Props> = ({ entries, name, onCancel, onComplete }) => {
    const [selected, setSelected] = useState<SearchEntry | null | undefined>()
    const [parentRequested, setParentRequested] = useState(false)
    return (
        <>
            <Speech mode="system">
                <p>{entries.length === 1 ? "Is this it?" : "Is it one of these?"}</p>
            </Speech>
            <SearchOptions entries={entries} includeNull={true} onSelect={setSelected} />
            {selected === null && (
                <>
                    <Speech mode="system">
                        <p>But you spelled it right?</p>
                    </Speech>
                    <UserVerification
                        affirmation="Yes, I did."
                        denial={<>Uh, maybe not.</>}
                        onAffirm={() => setParentRequested(true)}
                        onDeny={onCancel}
                    />
                    {parentRequested && <ParentSelector childName={name} onComplete={onComplete} />}
                </>
            )}
            {selected && <SearchSelector entry={selected} onComplete={onComplete} />}
        </>
    )
}
export default Entries
