import { UUID } from "@phylopic/utils"
import { FC, useState } from "react"
import NoBreak from "~/ui/NoBreak"
import UserTextForm from "~/ui/SiteNav/UserTextForm"
import UserScrollTo from "~/ui/UserScrollTo"
import NameInput from "./NameInput"
import NameRenderer from "./NameRenderer"
import NodeSearch from "./NodeSearch"
export type Props = {
    onComplete: (uuid: UUID) => void
}
const NodeForm: FC<Props> = ({ onComplete }) => {
    const [nameText, setNameText] = useState("")
    return (
        <>
            <UserTextForm
                editable={!nameText}
                onSubmit={setNameText}
                value={nameText}
                prefix={<NoBreak>It&rsquo;s&nbsp;</NoBreak>}
                postfix="."
                renderer={value => <NameRenderer value={value} />}
            >
                {(value, setValue) => (
                    <NameInput onChange={setValue} value={value} placeholder="species or other taxonomic group" />
                )}
            </UserTextForm>
            {nameText && <NodeSearch nameText={nameText} onCancel={() => setNameText("")} onComplete={onComplete} />}
            <UserScrollTo />
        </>
    )
}
export default NodeForm
