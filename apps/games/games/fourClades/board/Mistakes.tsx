import { CladesBoardContext } from "@phylopic/games"
import { useContext } from "react"
import styles from "./Mistakes.module.scss"
import clsx from "clsx"
const Mistakes = () => {
    const [state] = useContext(CladesBoardContext) ?? []
    if (state?.answers.length === 4) {
        return null
    }
    const mistakes = state?.mistakes ?? 0
    return (
        <section>
            Mistakes:{" "}
            <span className={styles.indicators}>
                {new Array(4).fill(null).map((_, index) => (
                    <span
                        key={index}
                        className={clsx(styles.indicator, index < mistakes ? styles.unavailable : styles.available)}
                    >
                        ⬤
                    </span>
                ))}
            </span>
        </section>
    )
}
export default Mistakes
