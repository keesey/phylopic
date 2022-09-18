import { UUID } from "@phylopic/utils"
import { FC } from "react"
import NamesEditor from "./NamesEditor"
import ParentEditor from "./ParentEditor"
export type Props = { uuid: UUID }
const NodeEditor: FC<Props> = ({ uuid }) => {
    return (
        <section>
            <dl>
                <dt>Parent</dt>
                <dd>
                    <ParentEditor uuid={uuid} />
                </dd>
                <dt>Names</dt>
                <dd>
                    <NamesEditor uuid={uuid} />
                </dd>
            </dl>
        </section>
    )
}
export default NodeEditor
