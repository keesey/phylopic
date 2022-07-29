import { useNomenText } from "@phylopic/ui"
import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import Image from "next/future/image"
import { FC, useCallback, useState } from "react"
import useFileSource from "~/editing/useFileSource"
import useRatioComplete from "~/editing/useRatioComplete"
import useSpecific from "~/editing/useSpecific"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const FileThumbnailView: FC<Props> = ({ uuid }) => {
    const { data: src, error: srcError, isValidating: srcIsValidating } = useFileSource(uuid)
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
    const { data: specific } = useSpecific(uuid)
    const ratioComplete = useRatioComplete(uuid)
    const alt = useNomenText(specific?.name)
    const error = Boolean(imgError || srcError || (!src && !srcIsValidating))
    const pending = Boolean(imgPending || (!src && srcIsValidating && !srcError))
    const loaded = Boolean(!imgError && !imgPending && src)
    return (
        <figure className={styles.main}>
            <div
                className={clsx(
                    styles.container,
                    loaded && styles.loaded,
                    error && styles.error,
                    pending && styles.pending,
                )}
            >
                <Image
                    alt={alt}
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
            {!error && ratioComplete < 1 && (
                <figcaption className={styles.caption}>
                    <progress className={styles.progress} value={ratioComplete} max={1} />
                </figcaption>
            )}
        </figure>
    )
}
export default FileThumbnailView
