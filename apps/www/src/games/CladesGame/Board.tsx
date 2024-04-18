import { CladesBoardContext } from "@phylopic/games"
import { FC, useContext } from "react"
import styles from "./Board.module.scss"
import Controls from "./Controls"
import Instructions from "./Instructions"
import AnswersGrid from "./AnswersGrid"
import ImageGrid from "./ImageGrid"
import Mistakes from "./Mistakes"

const Board: FC = () => {
    const [state] = useContext(CladesBoardContext) ?? []
    if (state?.answers.length === 4) {
        return (
            <section className={styles.main}>
                <p>You won!</p>
                <Controls />
            </section>
        )
    }
    if (state && state.mistakes >= 4) {
        return (
            <section className={styles.main}>
                <p>You lost!</p>
                <Controls />
            </section>
        )
    }
    return (
        <section className={styles.main}>
            <Instructions />
            <AnswersGrid />
            <ImageGrid />
            <Mistakes />
            <Controls />
        </section>
    )
}
export default Board
