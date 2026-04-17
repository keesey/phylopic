import { Link } from "@phylopic/api-models"
import { createSearch, getImageFileExtension, Hash, ImageMediaType, isHash, UUID } from "@phylopic/utils"
import axios, { AxiosProgressEvent } from "axios"
import { FC, useEffect, useMemo, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useContributorUUID from "~/profile/useContributorUUID"
import Dialogue from "~/ui/Dialogue"
import Speech from "~/ui/Speech"
import styles from "./index.module.scss"
import UploadError from "./UploadError"
export interface Props {
    buffer: Buffer
    filename?: string
    onCancel: () => void
    onComplete: (hash: Hash) => void
    existingUUID?: UUID
    type: ImageMediaType
}
const UploadProgress: FC<Props> = ({ buffer, filename, onCancel, onComplete, existingUUID, type }) => {
    const token = useAuthToken()
    const contributorUUID = useContributorUUID()
    const [loaded, setLoaded] = useState(0)
    const [total, setTotal] = useState(NaN)
    const [error, setError] = useState<Error | undefined>()
    const displayedFilename = useMemo<string>(
        () => (filename ? filename.replace(/\.[^.]+$/, "." + getImageFileExtension(type)) : "your image"),
        [filename, type],
    )
    useEffect(() => {
        if (buffer && contributorUUID && token) {
            const controller = new AbortController()
            const promise = axios.post<Link>(
                `${process.env.NEXT_PUBLIC_API_URL}/uploads${createSearch({ existing_uuid: existingUUID })}`,
                buffer,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                        "content-type": type,
                    },
                    onUploadProgress: (event: AxiosProgressEvent) => {
                        setLoaded(event.loaded)
                        setTotal(event.total ?? NaN)
                    },
                    responseType: "json",
                    signal: controller.signal,
                },
            )
            ;(async () => {
                try {
                    const response = await promise
                    const { href } = response.data
                    const hash = href.match(/\/([a-f0-9]+)$/)?.[1]
                    if (!isHash(hash)) {
                        throw 500
                    }
                    // :KLUDGE: Make sure it's ready
                    await new Promise(resolve => setTimeout(resolve, 500))
                    onComplete(hash)
                } catch (e) {
                    if (e instanceof Error) {
                        if (axios.isCancel(e)) {
                            console.warn("Upload canceled.")
                        } else {
                            setError(e)
                        }
                    } else {
                        setError(new Error(String(e)))
                    }
                }
            })()
            return () => controller.abort()
        }
    }, [buffer, contributorUUID, existingUUID, onComplete, token, type])
    if (error) {
        return <UploadError error={error} onCancel={onCancel} />
    }
    return (
        <Dialogue>
            <Speech mode="system">
                <p>Uploading {displayedFilename}&hellip;</p>
                <progress className={styles.progress} value={loaded} max={isNaN(total) ? undefined : total} />
            </Speech>
        </Dialogue>
    )
}
export default UploadProgress
