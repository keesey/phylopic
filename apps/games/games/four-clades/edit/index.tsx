"use client"
import { UUID } from "@phylopic/utils"
import { FC, useContext, useState } from "react"
import { ImageSearchSelector } from "~/components/ImageSearchSelector"
import { ImageUUIDThumbnailView } from "~/components/ImageUUIDThumbnailView"
import { Modal } from "~/components/Modal"
import { NodeUUIDNomenView } from "~/components/NodeUUIDNomenView"
import { EditorContext, EditorState, select } from "~/lib/edit"
import { Game } from "../models"
import styles from "./index.module.scss"
import { replace } from "./replace"
export interface Props {
    build: number
    readOnly: boolean
}
const Editor: FC<Props> = ({ build, readOnly }) => {
    const [state, dispatch] = useContext(EditorContext) ?? []
    const [editedUUID, setEditedUUID] = useState<UUID | null>(null)
    if (!state) {
        return null
    }
    const game = select.current(state as EditorState<Game>)
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
                            <button
                                key={imageUUID}
                                disabled={readOnly}
                                className={styles.imageEditButton}
                                onClick={readOnly ? undefined : () => setEditedUUID(imageUUID)}
                            >
                                <ImageUUIDThumbnailView uuid={imageUUID} />
                            </button>
                        ))}
                    </div>
                </section>
            ))}
            {editedUUID && (
                <Modal onClose={() => setEditedUUID(null)}>
                    <ImageSearchSelector
                        build={build}
                        excluded={new Set(game.answers.flatMap(answer => answer.imageUUIDs))}
                        onSelect={async image => {
                            try {
                                if (image) {
                                    dispatch?.({
                                        type: "PUSH",
                                        payload: await replace(game, editedUUID, image),
                                    })
                                    setEditedUUID(null)
                                }
                            } catch (e) {
                                alert(String(e))
                            }
                        }}
                    />
                </Modal>
            )}
        </section>
    )
}
export default Editor
