import { Node } from "@phylopic/source-models"
import { isNomen, Nomen } from "@phylopic/utils"
import { DragEvent, useCallback, useContext, FC } from "react"
import { NodeDestination } from "~/contexts/NodeSplitEditorContainer/Actions"
import Context from "~/contexts/NodeSplitEditorContainer/Context"
import NameView from "~/views/NameView"
import styles from "./index.module.scss"
import NamesEditor from "./NamesEditor"

export interface Props {
    identifier: NodeDestination
    node: Node
    parentName?: Nomen
}
const NodeEditor: FC<Props> = ({ identifier, node, parentName }) => {
    const [_, dispatch] = useContext(Context) ?? []
    const handleDrop = useCallback(
        (event: DragEvent<HTMLDListElement>) => {
            if (!dispatch) {
                return
            }
            event.preventDefault()
            const nameJSON = event.dataTransfer.getData("Name")
            if (nameJSON) {
                const name: Nomen = JSON.parse(nameJSON)
                if (!isNomen(name)) {
                    throw new Error("Not a name: " + nameJSON)
                }
                dispatch({
                    type: "MOVE_NAME",
                    payload: name,
                    meta: { destination: identifier },
                })
            }
        },
        [dispatch, identifier],
    )
    const className = [styles.main, identifier === "created" && "changed"].filter(Boolean).join(" ")
    return (
        <section className={className} onDragOver={event => event.preventDefault()} onDrop={handleDrop}>
            <header>
                <h3>
                    <NameView name={node.names[0]} />
                </h3>
            </header>
            <dl>
                <dt>Parent</dt>
                <dd>{parentName ? <NameView name={parentName} /> : "N/A"}</dd>
                <dt>Names</dt>
                <dd>
                    <NamesEditor names={node.names} />
                </dd>
            </dl>
        </section>
    )
}
export default NodeEditor
