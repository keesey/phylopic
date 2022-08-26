import { Nomen, UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import NameView from "~/ui/NameView"
import NoBreak from "~/ui/NoBreak"
import UserTextForm from "~/ui/SiteNav/UserTextForm"
import Speech from "~/ui/Speech"
import NameInput from "../../NameInput"
import NameRenderer from "../../NameRenderer"
import ParentSearch from "./ParentSearch"
export type Props = {
    childName: Nomen
    onComplete: (uuid: UUID) => void
}
export const ParentSelector: FC<Props> = ({ childName, onComplete }) => {
    const [nameText, setNameText] = useState("")
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
            {nameText && <ParentSearch childName={childName} nameText={nameText} onComplete={onComplete} />}
        </>
    )
}
export default ParentSelector
