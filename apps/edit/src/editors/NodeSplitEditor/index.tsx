import { UUID } from "@phylopic/utils"
import { FC, useContext } from "react"
import Context from "~/contexts/NodeSplitEditorContainer/Context"
import Controls from "./Controls"
import NodeEditor from "./NodeEditor"

export interface Props {
    onComplete: (uuid?: UUID) => void
}
const NodeSplitEditor: FC<Props> = ({ onComplete }) => {
    const [state] = useContext(Context) ?? []
    if (!state) {
        return null
    }
    return (
        <section>
            <NodeEditor identifier="original" node={state.original.value} parentName={state.original.parentName} />
            <NodeEditor identifier="created" node={state.created.value} parentName={state.created.parentName} />
            <Controls onComplete={onComplete} />
        </section>
    )
}
export default NodeSplitEditor
