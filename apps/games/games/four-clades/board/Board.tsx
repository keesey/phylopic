import { FC } from "react"
import AnswersGrid from "./AnswersGrid"
import styles from "./Board.module.scss"
import Controls from "./Controls"
import ImageGrid from "./ImageGrid"
import Mistakes from "./Mistakes"
import { GameOverDrawer } from "./GameOverDrawer"
export interface BoardProps {
    onNewGame?: () => void
}
const Board: FC<BoardProps> = ({ onNewGame }) => {
    return (
        <>
            <section className={styles.main}>
                <AnswersGrid onNewGame={onNewGame} />
                <div className={styles.playArea}>
                    <ImageGrid />
                    <Mistakes />
                    <Controls />
                </div>
            </section>
            <GameOverDrawer onNewGame={onNewGame} />
        </>
    )
}
export default Board
