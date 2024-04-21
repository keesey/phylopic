import { ImageThumbnailView } from "@phylopic/ui"
import { useContext } from "react"
import styles from "./AnswersGrid.module.scss"
import clsx from "clsx"
import { BoardContext, select } from "../play"
const AnswersGrid = () => {
    const [state] = useContext(BoardContext) ?? []
    const gameOver = Boolean(state && select.isOver(state))
    return (
        <section className={styles.main}>
            {state?.answers.map(answer => (
                <section key={answer.node.uuid} className={clsx(styles.row, gameOver && styles.gameOver)}>
                    <header className={styles.node}>{/*<NomenView value={answer.node.names[0]} short />*/}</header>
                    <div className={styles.images}>
                        {answer.imageUUIDs.map(uuid => (
                            <ImageThumbnailView key={uuid} value={state.images[uuid].image} />
                        ))}
                    </div>
                </section>
            ))}
        </section>
    )
    return null
}
export default AnswersGrid
