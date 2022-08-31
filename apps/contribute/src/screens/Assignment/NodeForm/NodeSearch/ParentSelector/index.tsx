import { Identifier, Nomen, stringifyNomen, UUID } from "@phylopic/utils"
import { FC, useCallback, useState } from "react"
import { SearchEntry } from "~/search/SearchEntry"
import NameView from "~/ui/NameView"
import NoBreak from "~/ui/NoBreak"
import UserTextForm from "~/ui/SiteNav/UserTextForm"
import Speech from "~/ui/Speech"
import NameInput from "../../NameInput"
import NameRenderer from "../../NameRenderer"
import ParentSearch from "./ParentSearch"
export type Props = {
    childName: Nomen
    onComplete: (identifier: Identifier, newTaxonName: string | null) => void
}
export const ParentSelector: FC<Props> = ({ childName, onComplete }) => {
    const [nameText, setNameText] = useState("")
    const [selected, setSelected] = useState<SearchEntry | null>(null)
    const onSelect = useCallback((entry: SearchEntry | null) => {
        setNameText(entry ? stringifyNomen(entry.name) : "")
        setSelected(entry)
    }, [])
    return (
        <>
            <Speech mode="system">
                <p>
                    Okay, just checking. Can I get the name of a larger group that <NameView value={childName} /> is
                    part of?
                </p>
            </Speech>
            <UserTextForm
                editable={!nameText}
                onSubmit={setNameText}
                value={nameText}
                prefix={<NoBreak>Sure, how about&nbsp;</NoBreak>}
                postfix="?"
                renderer={value => <NameRenderer value={value} />}
            >
                {(value, setValue) => <NameInput value={value} onChange={setValue} placeholder="more general group" />}
            </UserTextForm>
            {nameText && (
                <ParentSearch
                    childName={childName}
                    nameText={nameText}
                    selected={selected}
                    onSelect={onSelect}
                    onComplete={onComplete}
                />
            )}
        </>
    )
}
export default ParentSelector
