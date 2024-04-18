import { CladesBoardContext, cladesGameSelect } from "@phylopic/games"
import { ImageThumbnailView } from "@phylopic/ui"
import { useContext } from "react"
import styles from "./AnswersGrid.module.scss"
import NomenView from "~/views/NomenView"
import clsx from "clsx"
const AnswersGrid = () => {
    const [state] = useContext(CladesBoardContext) ?? []
    const gameOver = Boolean(state && cladesGameSelect.isOver(state))
    return (
        <section className={styles.main}>
            {state?.answers.map(answer => (
                <section key={answer.node.uuid} className={clsx(styles.row, gameOver && styles.gameOver)}>
                    <header className={styles.node}>
                        <NomenView value={answer.node.names[0]} short />
                    </header>
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
