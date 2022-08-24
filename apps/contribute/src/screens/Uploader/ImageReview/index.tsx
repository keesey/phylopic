/* eslint-disable @next/next/no-img-element */
import { isImageMediaType } from "@phylopic/utils"
import clsx from "clsx"
import { FC, useCallback, useMemo } from "react"
import LoadingState from "~/screens/LoadingState"
import Dialogue from "~/ui/Dialogue"
import {
    ICON_ARROW_DOWN,
    ICON_ARROW_LEFT,
    ICON_ARROW_RIGHT,
    ICON_ARROW_UP,
    ICON_CHECK,
    ICON_EQUALITY,
    ICON_PENCIL
} from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import useFileIsVector from "../hooks/useFileIsVector"
import useVectorization from "../hooks/useVectorization"
import useVectorizedImageSource from "../hooks/useVectorizedImageSource"
import styles from "./index.module.scss"
import { ReviewResult } from "./ReviewResult"
export interface Props {
    buffer: Buffer
    file: File
    onCancel?: () => void
    onComplete?: (result: ReviewResult) => void
    size: Readonly<[number, number]>
    source: string
}
const ImageReview: FC<Props> = ({ buffer, file, onCancel, onComplete, size, source }) => {
    const isVector = useFileIsVector(file)
    const vectorized = useVectorization(buffer, !isVector)
    const vectorizedSource = useVectorizedImageSource(vectorized.data)
    const mode = useMemo(() => (size[0] >= size[1] ? "landscape" : "portrait"), [size])
    const selectOriginal = useCallback(() => {
        if (isImageMediaType(file.type)) {
            onComplete?.({ buffer, source, type: file.type })
        } else {
            alert("Invalid image type: " + file.type)
        }
    }, [buffer, file.type, onComplete, source])
    const selectVectorized = useCallback(() => {
        if (vectorized.data && vectorizedSource) {
            onComplete?.({ buffer: Buffer.from(vectorized.data), source: vectorizedSource, type: "image/svg+xml" })
        }
    }, [onComplete, vectorized.data, vectorizedSource])
    if (vectorized.pending) {
        return <LoadingState>Give me a moment to process that&hellip;</LoadingState>
    }
    if (vectorizedSource) {
        return (
            <section className={styles.main}>
                <div className={clsx(styles.imageContainer, styles.compare, styles[mode])}>
                    <a className={styles.imageButton} onClick={selectOriginal} role="button" title={file.name}>
                        <img className={styles.image} src={source} alt={file.name} />
                    </a>
                    <a className={styles.imageButton} onClick={selectVectorized} role="button" title="vectorized image">
                        <img className={styles.image} src={vectorizedSource} alt="vectorized image" />
                    </a>
                </div>
                <Dialogue>
                    <Speech mode="system">
                        <p>Which one looks better?</p>
                    </Speech>
                    <UserOptions>
                        <UserButton
                            icon={mode === "portrait" ? ICON_ARROW_LEFT : ICON_ARROW_UP}
                            onClick={selectOriginal}
                        >
                            The {mode === "portrait" ? "left" : "top"} one.
                        </UserButton>
                        <UserButton
                            icon={mode === "portrait" ? ICON_ARROW_RIGHT : ICON_ARROW_DOWN}
                            onClick={selectVectorized}
                        >
                            The {mode === "portrait" ? "right" : "bottom"} one.
                        </UserButton>
                        <UserButton icon={ICON_EQUALITY} onClick={selectVectorized}>
                            They&rsquo;re the same picture.
                        </UserButton>
                        <UserButton danger icon={ICON_PENCIL} onClick={onCancel}>
                            Neither. I want to change it.
                        </UserButton>
                    </UserOptions>
                </Dialogue>
            </section>
        )
    }
    return (
        <section className={styles.main}>
            <div className={clsx(styles.imageContainer, styles[mode])}>
                <a className={styles.imageButton} onClick={selectOriginal} role="button" title={file.name}>
                    <img className={styles.image} src={source} alt={file.name} />
                </a>
            </div>
            <Dialogue>
                <Speech mode="system">
                    <p>How&rsquo;s that?</p>
                </Speech>
                {vectorized.error && (
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
