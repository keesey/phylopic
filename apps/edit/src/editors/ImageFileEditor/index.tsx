import { Image } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { isImageMediaType, UUID } from "@phylopic/utils"
import axios from "axios"
import clsx from "clsx"
import NextImage from "next/future/image"
import { ChangeEvent, DragEvent, FC, useCallback, useMemo, useState } from "react"
import useSWR from "swr"
import fetchObjectURLAndType from "~/fetchers/fetchObjectURLAndType"
import getImageFilename from "~/files/getImageFilename"
import styles from "./index.module.scss"
export interface Props {
    uuid: UUID
}
const ImageFileEditor: FC<Props> = ({ uuid }) => {
    const [pending, setPending] = useState(false)
    const imageKey = `/api/images/_/${encodeURIComponent(uuid)}`
    const key = imageKey + "/file"
    const { data: fileData, mutate } = useSWR(key, fetchObjectURLAndType)
    const { data: image, mutate: mutateImage } = useSWR<Image & { uuid: UUID }>(imageKey, fetchJSON)
    const { url: imageSrc, type: fileType } = fileData ?? {}
    const filename = useMemo(
        () => (image && isImageMediaType(fileType) ? getImageFilename(image, fileType) : "file.img"),
        [image, fileType],
    )
    const put = useCallback(
        (file: File | undefined) => {
            if (file) {
                if (!isImageMediaType(file.type)) {
                    alert("Invalid file type: " + file.type)
                    return
                }
                const newValue = { type: file.type, url: URL.createObjectURL(file) }
                mutate(
                    async () => {
                        setPending(true)
                        try {
                            await axios.put(key, Buffer.from(await file.arrayBuffer()), {
                                headers: {
                                    "content-type": file.type,
                                },
                            })
                        } finally {
                            setPending(false)
                        }
                        return newValue
                    },
                    { optimisticData: newValue, rollbackOnError: true },
                )
                mutateImage(undefined, { revalidate: true })
            }
        },
        [key, mutate, mutateImage],
    )
    const handleFigureDrop = useCallback(
        (event: DragEvent<HTMLElement>) => {
            const file = event.dataTransfer.files[0]
            put(file)
        },
        [put],
    )
    const handleFileChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files?.[0]
            put(file)
        },
        [put],
    )
    return (
        <figure onDrop={handleFigureDrop} className={clsx(styles.main, pending && "pending")}>
            <NextImage alt="Submission" src={imageSrc ?? "data:"} width={512} height={512} unoptimized />
            <nav>
                <a
                    key="download"
                    href={`/api/images/_/${encodeURIComponent(uuid)}/file?download=1`}
                    download={filename}
                    role="button"
                >
                    Download file &darr;
                </a>
                <label htmlFor="imagefile">Replace &uarr;</label>
                <input
                    disabled={pending}
                    id="imagefile"
                    key={`replace${imageSrc ? `:${imageSrc}` : ""}`}
                    onChange={handleFileChange}
                    type="file"
                />
            </nav>
        </figure>
    )
}
export default ImageFileEditor
