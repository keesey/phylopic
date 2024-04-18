import { CladesBoardContext } from "@phylopic/games"
import { ImageThumbnailView } from "@phylopic/ui"
import { useContext } from "react"
import styles from "./AnswersGrid.module.scss"
import NomenView from "~/views/NomenView"
const AnswersGrid = () => {
    const [state] = useContext(CladesBoardContext) ?? []
    const gameOver = state?.answers.length === 4 || state?.mistakes === 4
    return (
        <section className={styles.main}>
            {state?.answers.map(answer => (
                <section key={answer.node.uuid} className={styles.row}>
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
