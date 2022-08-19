/* eslint-disable @next/next/no-img-element */
import { isImageMediaType } from "@phylopic/utils"
import clsx from "clsx"
import { FC, useCallback, useMemo } from "react"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import useFileIsVector from "../hooks/useFileIsVector"
import useVectorization from "../hooks/useVectorization"
import useVectorizedImageSource from "../hooks/useVectorizedImageSource"
import Pending from "../Pending"
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
    const handleSelectButtonClick = useCallback(() => {
        if (isImageMediaType(file.type)) {
            onComplete?.({ buffer, source, type: file.type })
        } else {
            alert("Invalid image type: " + file.type)
        }
    }, [buffer, file.type, onComplete, source])
    const handleSelectVectorizedButtonClick = useCallback(() => {
        if (vectorized.data && vectorizedSource) {
            onComplete?.({ buffer: Buffer.from(vectorized.data), source: vectorizedSource, type: "image/svg+xml" })
        }
    }, [onComplete, vectorized.data, vectorizedSource])
    if (vectorized.pending) {
        return <Pending />
    }
    if (vectorizedSource) {
        return (
            <section className={styles.main}>
                <div className={clsx(styles.imageContainer, styles.compare, styles[mode])}>
                    <img className={styles.image} src={source} alt={file.name} />
                    <img className={styles.image} src={vectorizedSource} alt="vectorized" />
                </div>
                <Dialogue>
                    <Speech mode="system">
                        <p>Which one looks better?</p>
                    </Speech>
                    <UserOptions>
                        <UserButton onClick={handleSelectButtonClick}>
                            The {mode === "portrait" ? "left" : "top"} one.
                        </UserButton>
                        <UserButton onClick={handleSelectVectorizedButtonClick}>
                            The {mode === "portrait" ? "right" : "bottom"} one.
                        </UserButton>
                        <UserButton onClick={handleSelectVectorizedButtonClick}>
                            They&rsquo;re the same picture.
                        </UserButton>
                        <UserButton danger onClick={onCancel}>
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
                <img className={styles.image} src={source} alt={file.name} />
            </div>
            <Dialogue>
                <Speech mode="system">
                    <p>How&rquo;s that?</p>
                </Speech>
                {vectorized.error && (
                    <Speech mode="system">
                        <p>(I tried to vectorize it, but ran into a problem.</p>
                        <p>&ldquo;{String(vectorized.error)}&rdquo;)</p>
                    </Speech>
                )}
                <UserOptions>
                    <UserButton onClick={handleSelectButtonClick}>Looks good.</UserButton>
                    <UserButton danger onClick={onCancel}>
                        Wait, I want to change it.
                    </UserButton>
                </UserOptions>
            </Dialogue>
        </section>
    )
}
export default ImageReview
