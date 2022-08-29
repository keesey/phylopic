import { Nomen } from "@phylopic/utils"
import { FC } from "react"
import NameEditor from "~/editors/NameEditor"
import Modal from "~/ui/Modal"
export interface Props {
    name: Nomen | null
    onComplete: (value: Nomen | null) => void
}
const NameModal: FC<Props> = ({ name, onComplete }) => {
    if (!name) {
        return null
    }
    return (
        <Modal onClose={() => onComplete(null)} title="Edit Name">
            <NameEditor value={name} onChange={value => onComplete(value)} />
        </Modal>
    )
}
export default NameModal
