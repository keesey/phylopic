import clsx from "clsx"
import { useContext } from "react"
import { BoardContext } from "../play"
import styles from "./Mistakes.module.scss"
const Mistakes = () => {
    const [state] = useContext(BoardContext) ?? []
    const mistakes = state?.mistakes ?? 0
    return (
        <section className={styles.main}>
            <span className={styles.message}>Mistakes remaining:</span>
            <span className={styles.indicators}>
                {new Array(4).fill(null).map((_, index) => (
                    <span
                        key={index}
                        className={clsx(styles.indicator, index >= mistakes ? styles.available : styles.unavailable)}
                    >
                        ⬤
                    </span>
                ))}
            </span>
        </section>
    )
}
export default Mistakes