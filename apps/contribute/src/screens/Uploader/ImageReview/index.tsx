import { isImageMediaType } from "@phylopic/utils"
import { FC, useCallback, useMemo, useState } from "react"
import MAX_FILE_SIZE from "~/filesizes/MAX_FILE_SIZE"
import LoadingState from "~/screens/LoadingState"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_LEFT, ICON_CHECK, ICON_PENCIL, ICON_X } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import useFileIsVector from "../hooks/useFileIsVector"
import useVectorization from "../hooks/useVectorization"
import useVectorizedImageSource from "../hooks/useVectorizedImageSource"
import ImageBox from "./ImageBox"
import { ReviewResult } from "./ReviewResult"
import styles from "./index.module.scss"
import { FileResult } from "../SelectFile/FileResult"
export type Props = FileResult & {
    onCancel?: () => void
    onComplete?: (result: ReviewResult) => void
}
const ImageReview: FC<Props> = ({ buffer, file, onCancel, onComplete, size, source }) => {
    const isVector = useFileIsVector(file)
    const vectorized = useVectorization(buffer, !isVector)
    const vectorizedBuffer = useMemo(
        () => (vectorized.data ? Buffer.from(vectorized.data) : undefined),
        [vectorized.data],
    )
    const vectorizedSource = useVectorizedImageSource(vectorized.data)
    const [vectorPreferred, setVectorPreferred] = useState(true)
    const selectOriginal = useCallback(() => {
        if (isImageMediaType(file.type)) {
            onComplete?.({ buffer, source, type: file.type })
        } else {
            alert("Invalid image type: " + file.type)
        }
    }, [buffer, file.type, onComplete, source])
    const selectVectorized = useCallback(() => {
        if (vectorizedBuffer && vectorizedSource) {
            onComplete?.({ buffer: vectorizedBuffer, source: vectorizedSource, type: "image/svg+xml" })
        }
    }, [onComplete, vectorizedBuffer, vectorizedSource])
    if (vectorized.pending) {
        return <LoadingState>Give me a moment to process that&hellip;</LoadingState>
    }
    const vectorizedTooLarge = Boolean(vectorizedBuffer && vectorizedBuffer.length > MAX_FILE_SIZE)
    if (vectorizedSource && !vectorizedTooLarge) {
        if (vectorPreferred) {
            return (
                <section className={styles.main}>
                    <ImageBox source={vectorizedSource} alt="vectorized image" size={size} />
                    <Dialogue>
                        <Speech mode="system">
                            <p>Does that look right?</p>
                        </Speech>
                        <UserOptions>
                            <UserButton icon={ICON_CHECK} onClick={selectVectorized}>
                                Yes, looks good!
                            </UserButton>
                            <UserButton icon={ICON_X} onClick={() => setVectorPreferred(false)}>
                                No, that looks wrong.
                            </UserButton>
                            <UserButton danger icon={ICON_PENCIL} onClick={onCancel}>
                                Actually, let me upload a different file.
                            </UserButton>
                        </UserOptions>
                    </Dialogue>
                </section>
            )
        }
        return (
            <section className={styles.main}>
                <ImageBox source={source} alt={file.name} size={size} />
                <Dialogue>
                    <Speech mode="system">
                        <p>Is that better?</p>
                    </Speech>
                    <UserOptions>
                        <UserButton icon={ICON_CHECK} onClick={selectOriginal}>
                            Yes, thank you.
                        </UserButton>
                        <UserButton icon={ICON_ARROW_LEFT} onClick={() => setVectorPreferred(true)}>
                            Let me see the other one again&hellip;
                        </UserButton>
                        <UserButton danger icon={ICON_PENCIL} onClick={onCancel}>
                            Actually, let me upload a different file.
                        </UserButton>
                    </UserOptions>
                </Dialogue>
            </section>
        )
    }
    return (
        <section className={styles.main}>
            <ImageBox source={source} alt={file.name} size={size} />
            <Dialogue>
                <Speech mode="system">
                    <p>How&rsquo;s that?</p>
                </Speech>
                {vectorizedTooLarge && (
                    <Speech mode="system">
                        <p>
                            <small>(I tried to vectorize it, but the file was too large.)</small>
                        </p>
                    </Speech>
                )}
                {!vectorizedTooLarge && vectorized.error && (
                    <Speech mode="system">
                        <p>
                            <small>I tried to vectorize it, but ran into a problem.</small>
                        </p>
                        <p>
                            <small>&ldquo;{String(vectorized.error)}&rdquo;</small>
                        </p>
                    </Speech>
                )}
                <UserOptions>
                    <UserButton icon={ICON_CHECK} onClick={selectOriginal}>
                        Looks good.
                    </UserButton>
                    <UserButton danger icon={ICON_PENCIL} onClick={onCancel}>
                        Wait, I want to change it.
                    </UserButton>
                </UserOptions>
            </Dialogue>
        </section>
    )
}
export default ImageReview
