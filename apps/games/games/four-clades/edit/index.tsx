"use client"
import { ImageThumbnailView } from "@phylopic/ui"
import { useContext } from "react"
import { EditorContext, EditorState, select } from "~/lib/edit"
import { Game } from "../models"
import styles from "./index.module.scss"
import NomenView from "~/components/NomenView"
const Editor = () => {
    const [state] = useContext(EditorContext) ?? []
    if (!state) {
        return null
    }
    const game = select.current<Game>(state as EditorState<Game>)
    if (!game?.answers?.length) {
        return null
    }
    return (
        <section className={styles.main}>
            {game.answers.map(answer => (
                <section key={answer.node.uuid} className={styles.row}>
                    <header className={styles.node}>
                        <NomenView value={answer.node.names[0]} short />
                    </header>
                    <div className={styles.images}>
                        {answer.images.map(image => (
                            <ImageThumbnailView key={image.uuid} value={image} />
                        ))}
                    </div>
                </section>
            ))}
        </section>
    )
}
export default Editor
