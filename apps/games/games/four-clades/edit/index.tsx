"use client"
import { FC, useContext } from "react"
import { ImageUUIDThumbnailView } from "~/components/ImageUUIDThumbnailView"
import { NodeUUIDNomenView } from "~/components/NodeUUIDNomenView"
import { EditorContext, EditorState, select } from "~/lib/edit"
import { Game } from "../models"
import styles from "./index.module.scss"
export interface Props {
    readOnly: boolean
}
const Editor: FC<Props> = ({ readOnly }) => {
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
                <section key={answer.nodeUUID} className={styles.row}>
                    <header className={styles.node}>
                        <NodeUUIDNomenView uuid={answer.nodeUUID} short />
                    </header>
                    <div className={styles.images}>
                        {answer.imageUUIDs.map(imageUUID => (
                            <div key={imageUUID}>
                                <ImageUUIDThumbnailView uuid={imageUUID} />
                                {/* :TODO: Edit button */}
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </section>
    )
}
export default Editor
