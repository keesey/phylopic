/* eslint-disable @next/next/no-img-element */
import clsx from "clsx"
import { FC, useCallback, useMemo } from "react"
import FullScreen from "~/pages/screenTypes/FullScreen"
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
        onComplete?.({ buffer, source, type: file.type })
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
                <div>
                    <p>Which one looks better?</p>
                    <nav>
                        <button onClick={handleSelectButtonClick}>
                            The {mode === "portrait" ? "left" : "top"} one.
                        </button>
                        <button onClick={handleSelectVectorizedButtonClick}>
                            The {mode === "portrait" ? "right" : "bottom"} one.
                        </button>
                        <button onClick={handleSelectVectorizedButtonClick}>They&apos;re the same picture.</button>
                        <button onClick={onCancel}>Neither. I want to change it.</button>
                    </nav>
                </div>
            </section>
        )
    }
    return (
        <FullScreen>
            <section className={styles.main}>
                <div className={clsx(styles.imageContainer, styles[mode])}>
                    <img className={styles.image} src={source} alt={file.name} />
                </div>
                <div>
                    <p>How&apos;s that?</p>
                    {vectorized.error && (
                        <p>(I tried to vectorize it, but ran into a problem: {String(vectorized.error)}.)</p>
                    )}
                    <nav>
                        <button className="cta" onClick={handleSelectButtonClick}>Looks good.</button>
                        <button className="cta" onClick={onCancel}>Wait, I want to change it.</button>
                    </nav>
                </div>
            </section>
        </FullScreen>
    )
}
export default ImageReview
