import { FC } from "react"
import AnswersGrid from "./AnswersGrid"
import styles from "./Board.module.scss"
import Controls from "./Controls"
import ImageGrid from "./ImageGrid"
import Mistakes from "./Mistakes"
const Board: FC = () => {
    return (
        <section className={styles.main}>
            <AnswersGrid />
            <ImageGrid />
            <Mistakes />
            <Controls />
        </section>
    )
}
export default Board
