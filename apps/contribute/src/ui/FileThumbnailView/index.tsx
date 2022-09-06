import clsx from "clsx"
import Image from "next/future/image"
import { FC, useCallback, useState } from "react"
import styles from "./index.module.scss"
export interface Props {
    alt?: string
    small?: boolean
    src?: string
}
const FileThumbnailView: FC<Props> = ({ alt, src, small }) => {
    const [imgError, setImgError] = useState(false)
    const [imgPending, setImgPending] = useState(true)
    const handleImgError = useCallback(() => {
        setImgPending(false)
        setImgError(true)
    }, [])
    const handleImgLoad = useCallback(() => {
        setImgPending(false)
        setImgError(false)
    }, [])
    const handleImgLoadStart = useCallback(() => {
        setImgPending(true)
        setImgError(false)
    }, [])
    const imgLoaded = !imgError && !imgPending
    return (
        <div
            className={clsx(
                styles.main,
                small && styles.small,
                imgLoaded && src && styles.loaded,
                imgError && src && styles.error,
                (imgPending || !src) && styles.pending,
            )}
        >
            {src && (
                <Image
                    alt={alt ?? "silhouette image"}
                    height={small ? 64 : 128}
                    onErrorCapture={handleImgError}
                    onLoad={handleImgLoad}
                    onLoadStart={handleImgLoadStart}
                    src={src}
                    unoptimized
                    width={small ? 64 : 128}
                />
            )}
            {imgError && <p>image missing</p>}
        </div>
    )
}
export default FileThumbnailView
