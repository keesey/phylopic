"use client"
import { FC, useContext } from "react"
import { BoardContext, select } from "../play"
import styles from "./Controls.module.scss"
export interface ControlsProps {
    onRestart?: () => void
}
const Controls: FC<ControlsProps> = ({ onRestart }) => {
    const [state, dispatch] = useContext(BoardContext) ?? []
    const canShuffle = Boolean(state && !select.isOver(state))
    const canDeselectAll = Boolean(state && select.hasSelection(state))
    const canSubmit = Boolean(state && select.isSubmittable(state))
    return (
        <section className={styles.main}>
            <button
                className={styles.secondary}
                disabled={!canShuffle}
                onClick={canShuffle ? () => dispatch?.({ type: "SHUFFLE" }) : undefined}
            >
                Shuffle
            </button>
            <button
                className={styles.secondary}
                disabled={!canDeselectAll}
                onClick={canDeselectAll ? () => dispatch?.({ type: "DESELECT_ALL" }) : undefined}
            >
                Deselect all
            </button>
            <button
                className={styles.primary}
                disabled={!canSubmit}
                onClick={canSubmit ? () => dispatch?.({ type: "SUBMIT" }) : undefined}
            >
                Submit
            </button>
        </section>
    )
}
export default Controls
