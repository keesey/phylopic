import { UUID } from "@phylopic/utils"
import React, { DragEvent, useCallback, useContext, FC } from "react"
import Context from "~/contexts/PhylogenyEditorContainer/Context"
import BubbleItem from "~/ui/BubbleItem"
import BubbleList from "~/ui/BubbleList"
import NameView from "~/views/NameView"
import styles from "./DeletedNodes.module.scss"

export interface Props {
    x1: number
    x2: number
    y1: number
    y2: number
}
const DeletedNodes: FC<Props> = ({ x1, x2, y1, y2 }) => {
    const [state, dispatch] = useContext(Context) ?? []
    const handleDrop = useCallback(
        (event: DragEvent<HTMLUListElement>) => {
            const uuid = event.dataTransfer.getData("UUID")?.toLowerCase()
            if (uuid && dispatch) {
                dispatch({ type: "DELETE_NODE", payload: { uuid } })
            }
        },
        [dispatch],
    )
    if (!state) {
        return null
    }
    const originalUUIDs = Object.keys(state.original.nodesMap)
    const modifiedUUIDSet = new Set<UUID>(Object.keys(state.modified.nodesMap))
    const deletedUUIDs = originalUUIDs.filter(uuid => !modifiedUUIDSet.has(uuid)).sort()
    return (
        <foreignObject className={styles.main} x={x1} width={x2 - x1} y={y1} height={y2 - y1}>
            <BubbleList onDragOver={event => event.preventDefault()} onDrop={handleDrop}>
                {deletedUUIDs.map(uuid => {
                    const node = state.original.nodesMap[uuid]
                    if (!node) {
                        return null
                    }
                    return (
                        <BubbleItem
                            changed
                            deleted
                            draggable
                            key={uuid}
                            onDragStart={event => event.dataTransfer.setData("UUID", uuid)}
                        >
                            <NameView
                                name={node.names[0]}
                                short
                                title={node.names[0].map(({ text }) => text).join(" ")}
                            />
                        </BubbleItem>
                    )
                })}
            </BubbleList>
        </foreignObject>
    )
}
export default DeletedNodes
