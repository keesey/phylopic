import React, { useContext, FC } from "react"
import NameEditorContainer from "~/contexts/NameEditorContainer"
import Context from "~/contexts/NodeEditorContainer/Context"
import NameEditor from "~/editors/NameEditor"
import Modal from "~/ui/Modal"
import Controls from "./Controls"

export interface Props {
    nameIndex: number
    onComplete: () => void
}
const NameModal: FC<Props> = ({ nameIndex, onComplete }) => {
    const [state] = useContext(Context) ?? []
    const name = state?.modified.node.names[nameIndex]
    if (!name) {
        return null
    }
    return (
        <Modal onClose={onComplete} title="Edit Name">
            <NameEditorContainer name={name} index={nameIndex}>
                <NameEditor />
                <Controls onComplete={onComplete} />
            </NameEditorContainer>
        </Modal>
    )
}
export default NameModal
