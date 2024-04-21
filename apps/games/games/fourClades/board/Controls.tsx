import { FC, useContext } from "react"
import { BoardContext, select } from "../play"
import styles from "./Controls.module.scss"
export interface ControlsProps {
    onRestart?: () => void
}

const Controls: FC<ControlsProps> = ({ onRestart }) => {
    const [state, dispatch] = useContext(BoardContext) ?? []
    if (state && select.isOver(state)) {
        return (
            <section className={styles.main}>
                <button className={styles.primary} onClick={() => onRestart?.()}>
                    Start a new game
                </button>
            </section>
        )
    }
    return (
        <section className={styles.main}>
            <button className={styles.secondary} onClick={() => dispatch?.({ type: "SHUFFLE" })}>
                Shuffle
            </button>
            <button className={styles.secondary} onClick={() => dispatch?.({ type: "DESELECT_ALL" })}>
                Deselect all
            </button>
            <button className={styles.primary} onClick={() => dispatch?.({ type: "SUBMIT" })}>
                Submit
            </button>
        </section>
    )
}
export default Controls
