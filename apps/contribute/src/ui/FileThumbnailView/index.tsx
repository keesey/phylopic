import clsx from "clsx"
import Image from "next/future/image"
import { FC, useCallback, useState } from "react"
import styles from "./index.module.scss"
export interface Props {
    alt?: string
    src?: string
}
const FileThumbnailView: FC<Props> = ({ alt, src }) => {
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
                imgLoaded && styles.loaded,
                imgError && styles.error,
                imgPending && styles.pending,
            )}
        >
            <Image
                alt={alt ?? "silhouette image"}
                height={96}
                onErrorCapture={handleImgError}
                onLoad={handleImgLoad}
                onLoadStart={handleImgLoadStart}
                src={src ?? "data:"}
                unoptimized
                width={96}
            />
            {imgError && <p>image missing</p>}
        </div>
    )
}
export default FileThumbnailView
