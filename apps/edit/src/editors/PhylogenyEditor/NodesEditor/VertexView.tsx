import { isUUID, normalizeUUID } from "@phylopic/utils"
import { DragEvent, useCallback, useContext, FC } from "react"
import Context from "~/contexts/PhylogenyEditorContainer/Context"
import BubbleNode from "~/ui/BubbleNode"
import NameView from "~/views/NameView"
import { Vertex } from "./Vertex"
import styles from "./VertexView.module.scss"
import VERTEX_HEIGHT from "./VERTEX_HEIGHT"
import VERTEX_SPACING from "./VERTEX_SPACING"
import VERTEX_WIDTH from "./VERTEX_WIDTH"

export interface Props {
    vertex: Vertex
}
const FONT_SIZE = 12
const VertexView: FC<Props> = ({ vertex }) => {
    const x = vertex.column * (VERTEX_WIDTH + VERTEX_SPACING[0]) + VERTEX_SPACING[0]
    const y = vertex.row * (VERTEX_HEIGHT + VERTEX_SPACING[1]) + VERTEX_SPACING[1]
    const [state, dispatch] = useContext(Context) ?? []
    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            const uuid = normalizeUUID(String(event.dataTransfer.getData("UUID")))
            if (!state?.modified.nodesMap || !dispatch || !isUUID(uuid) || uuid === vertex.uuid) {
                return
            }
            const selfNode = state.modified.nodesMap[vertex.uuid]
            const otherNode = state.modified.nodesMap[uuid]
            if (!selfNode || !otherNode) {
                return
            }
            event.preventDefault()
            if (selfNode.parent === uuid || otherNode.parent === vertex.uuid || otherNode.parent === selfNode.parent) {
                dispatch({
                    type: "MERGE_NODES",
                    payload: { destination: vertex.uuid, source: uuid },
                })
            } else {
                dispatch({
                    type: "SET_NODE_PARENT",
                    payload: { child: uuid, parent: vertex.uuid },
                })
            }
        },
        [dispatch, state?.modified.nodesMap, vertex.uuid],
    )
    return (
        <foreignObject id={vertex.uuid} x={x} y={y} width={VERTEX_WIDTH} height={VERTEX_HEIGHT} fontSize={FONT_SIZE}>
            <BubbleNode
                changed={vertex.changed}
                className={styles.node}
                draggable
                onDragOver={event => event.preventDefault()}
                onDragStart={event => event.dataTransfer.setData("UUID", vertex.uuid)}
                onDrop={handleDrop}
            >
                <NameView name={vertex.name} short title={vertex.name.map(({ text }) => text).join(" ")} />
            </BubbleNode>
        </foreignObject>
    )
}
export default VertexView
