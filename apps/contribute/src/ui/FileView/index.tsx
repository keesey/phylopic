import clsx from "clsx"
import Image from "next/image"
import React, { useCallback, useState } from "react"
import styles from "./index.module.scss"
export interface Props {
    alt?: string
    mode: "dark" | "light"
    src?: string
}
const FileView: React.FC<Props> = ({ alt, mode, src }) => {
    const [error, setError] = useState(false)
    const [pending, setPending] = useState(true)
    const handleError = useCallback(() => {
        setPending(false)
        setError(true)
    }, [])
    const handleLoad = useCallback(() => {
        setPending(false)
        setError(false)
    }, [])
    const handleLoadStart = useCallback(() => {
        setPending(true)
        setError(false)
    }, [])
    return (
        <div
            className={clsx(
                styles.main,
                styles[mode],
                !error && !pending && styles.loaded,
                error && styles.error,
                pending && styles.pending,
            )}
        >
            <Image
                alt={alt ?? "silhouette"}
                height={256}
                onErrorCapture={handleError}
                onLoad={handleLoad}
                onLoadStart={handleLoadStart}
                src={src ?? "data:<svg></svg>"}
                unoptimized
                width={256}
            />
            {error && <p>image missing</p>}
        </div>
    )
}
export default FileView
