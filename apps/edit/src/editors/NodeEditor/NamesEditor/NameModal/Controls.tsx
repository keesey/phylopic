import { stringifyNormalized } from "@phylopic/utils"
import React, { useCallback, useContext, FC } from "react"
import NameContext from "~/contexts/NameEditorContainer/Context"
import NodeContext from "~/contexts/NodeEditorContainer/Context"
import styles from "./Controls.module.scss"

export interface Props {
    onComplete: () => void
}
const Controls: FC<Props> = ({ onComplete }) => {
    const [nameState] = useContext(NameContext) ?? []
    const [_, nodeDispatch] = useContext(NodeContext) ?? []
    const handleUpdateClick = useCallback(() => {
        if (nodeDispatch && nameState?.original && nameState.modified) {
            nodeDispatch({ type: "REMOVE_NAME", payload: nameState?.original })
            nodeDispatch({ type: "ADD_NAME", payload: nameState?.modified })
        }
        onComplete()
    }, [nameState?.modified, nameState?.original, nodeDispatch, onComplete])
    const changed = stringifyNormalized(nameState?.modified) !== stringifyNormalized(nameState?.original)
    return (
        <nav className={styles.main}>
            <button disabled={!changed} onClick={changed ? handleUpdateClick : undefined}>
                Update
            </button>
            <button onClick={onComplete}>Cancel</button>
        </nav>
    )
}
export default Controls
