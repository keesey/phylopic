import { ImageMediaType } from "@phylopic/utils"
import React, { ChangeEvent, DragEvent, useCallback, useState, FC } from "react"
import styles from "./index.module.scss"
import upload from "./upload"

export interface Props {
    apiPath: string
    mediaType: ImageMediaType
}
const ImageFileEditor: FC<Props> = ({ apiPath, mediaType: fileType }) => {
    const [replaceKey, setReplaceKey] = useState<string | undefined>()
    const [cachebuster, setCachebuster] = useState<string | undefined>()
    const [pending, setPending] = useState(false)
    const performUpload = useCallback(
        (file: File | undefined) => {
            if (apiPath && file) {
                ;(async () => {
                    setPending(true)
                    const now = new Date().valueOf().toString()
                    try {
                        await upload(apiPath, file)
                    } catch (e) {
                        return alert(e)
                    } finally {
                        setReplaceKey(now)
                        setPending(false)
                    }
                    setCachebuster(now)
                })()
            }
        },
        [apiPath],
    )
    const handleFigureDrop = useCallback(
        (event: DragEvent<HTMLElement>) => {
            const file = event.dataTransfer.files[0]
            performUpload(file)
        },
        [performUpload],
    )
    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files?.[0]
            performUpload(file)
        },
        [performUpload],
    )
    if (!apiPath) {
        return null
    }
    const className = [styles.main, pending && "pending"].filter(Boolean).join(" ")
    return (
        <figure onDrop={handleFigureDrop} className={className}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                alt="Original Submission"
                src={`${apiPath}${cachebuster ? `?${encodeURIComponent(cachebuster)}` : ""}`}
            />
            <nav>
                <a key="download" href={`${apiPath}?download=1`} download role="button">
                    Download {fileType === "image/png" ? "PNG" : "SVG"} &darr;
                </a>
                <label htmlFor="imagefile">Replace &uarr;</label>
                <input
                    disabled={pending}
                    id="imagefile"
                    key={`replace${replaceKey ? `:${replaceKey}` : ""}`}
                    onChange={handleFileChange}
                    type="file"
                />
            </nav>
        </figure>
    )
}
export default ImageFileEditor
