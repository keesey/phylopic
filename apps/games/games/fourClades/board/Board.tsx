import { FC } from "react"
import AnswersGrid from "./AnswersGrid"
import styles from "./Board.module.scss"
import Controls from "./Controls"
import ImageGrid from "./ImageGrid"
import Instructions from "./Instructions"
import Mistakes from "./Mistakes"
export interface BoardProps {
    onRestart?: () => void
}
const Board: FC<BoardProps> = ({ onRestart }) => {
    return (
        <section className={styles.main}>
            <Instructions />
            <AnswersGrid />
            <ImageGrid />
            <Mistakes />
            <Controls onRestart={onRestart} />
        </section>
    )
}
export default Board
