import { UUID } from "@phylopic/utils"
import React, { useCallback, useContext, useEffect, FC } from "react"
import Context from "~/contexts/NodeSplitEditorContainer/Context"
import useSave from "~/contexts/NodeSplitEditorContainer/useSave"
import styles from "./Controls.module.scss"

export interface Props {
    onComplete: (uuid?: UUID) => void
}
const Controls: FC<Props> = ({ onComplete }) => {
    const [state, dispatch] = useContext(Context) ?? []
    const save = useSave()
    const { error, created, original, pending } = state || {}
    const handleSplitClick = useCallback(() => {
        if (!created || !original) {
            return
        }
        ;(async () => {
            await save()
            if (original.value.parent === created.uuid) {
                return onComplete(original.uuid)
            }
            onComplete(created.uuid)
        })()
    }, [created, onComplete, original, save])
    useEffect(() => {
        if (error) {
            onComplete()
            alert(error)
        }
    }, [error, onComplete])
    const className = [styles.main, !dispatch && styles.hidden].filter(Boolean).join(" ")
    return (
        <nav className={className}>
            <button disabled={pending} onClick={() => onComplete()}>
                Cancel
            </button>
            <button disabled={Boolean(error) || pending} onClick={!(error || pending) ? handleSplitClick : undefined}>
                Split
            </button>
        </nav>
    )
}
export default Controls
