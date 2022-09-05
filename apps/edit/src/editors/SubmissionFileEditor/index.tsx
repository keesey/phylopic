import { Submission } from "@phylopic/source-models"
import { Hash, isImageMediaType } from "@phylopic/utils"
import NextImage from "next/future/image"
import { FC, useMemo } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import fetchObjectURLAndType from "~/fetch/fetchObjectURLAndType"
import getSubmissionFilename from "~/files/getSubmissionFilename"
import styles from "./index.module.scss"
export interface Props {
    hash: Hash
}
const SubmissionFileEditor: FC<Props> = ({ hash }) => {
    const submissionKey = `/api/submissions/_/${encodeURIComponent(hash)}`
    const { data: submission } = useSWR<Submission>(submissionKey, fetchJSON)
    const key = submissionKey + "/file"
    const { data: fileData } = useSWR(key, fetchObjectURLAndType)
    const { url: imgSrc, type: fileType } = fileData ?? {}
    const filename = useMemo(
        () =>
            submission && isImageMediaType(fileType)
                ? getSubmissionFilename({ ...submission, hash }, fileType)
                : "file.img",
        [fileType, submission],
    )
    // :TODO: Ability to replace image
    /*
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
    */
    return (
        <figure className={styles.main}>
            <NextImage alt="Submission" src={imgSrc ?? "data:"} width={512} height={512} unoptimized />
            <nav>
                <a
                    key="download"
                    href={`/api/submissions/_/${encodeURIComponent(hash)}/file?download=1`}
                    download={filename}
                    role="button"
                >
                    Download file &darr;
                </a>
                {/*<label htmlFor="imagefile">Replace &uarr;</label>
                <input
                    disabled={pending}
                    id="imagefile"
                    key={`replace${imageSrc ? `:${imageSrc}` : ""}`}
                    onChange={handleFileChange}
                    type="file"
                />
    */}
            </nav>
        </figure>
    )
}
export default SubmissionFileEditor
