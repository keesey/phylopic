import styles from "./Controls.module.scss"
import { CladesBoardContext } from "@phylopic/games"
import { useContext } from "react"

const Controls = () => {
    const [state, dispatch] = useContext(CladesBoardContext) ?? []
    if (state?.answers.length === 4 || state?.mistakes === 4) {
        // :TODO: Play again button
        return null
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
