import { UUID } from "@phylopic/utils"
import { FC, useState } from "react"
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
                renderer={value => <NameRenderer value={value} />}
            >
                {(value, setValue) => (
                    <NameInput onChange={setValue} value={value} placeholder="Species or other taxonomic group" />
                )}
            </UserTextForm>
            {nameText && <NodeSearch nameText={nameText} onCancel={() => setNameText("")} onComplete={onComplete} />}
            <UserScrollTo />
        </>
    )
}
export default NodeForm
