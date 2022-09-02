import { Link } from "@phylopic/api-models"
import { getImageFileExtension, Hash, ImageMediaType, isHash } from "@phylopic/utils"
import axios from "axios"
import { FC, useEffect, useMemo, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useContributorUUID from "~/profile/useContributorUUID"
import Dialogue from "~/ui/Dialogue"
import { ICON_ARROW_LEFT } from "~/ui/ICON_SYMBOLS"
import Speech from "~/ui/Speech"
import UserButton from "~/ui/UserButton"
import UserOptions from "~/ui/UserOptions"
import styles from "./index.module.scss"
export interface Props {
    buffer: Buffer
    filename?: string
    onCancel: () => void
    onComplete: (hash: Hash) => void
    type: ImageMediaType
}
const UploadProgress: FC<Props> = ({ buffer, filename, onCancel, onComplete, type }) => {
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
            const promise = axios.post<Link>(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/uploads`, buffer, {
                headers: {
                    authorization: `Bearer ${token}`,
                    "content-type": type,
                },
                onUploadProgress: (event: ProgressEvent) => {
                    setLoaded(event.loaded)
                    setTotal(event.total)
                },
                responseType: "json",
                signal: controller.signal,
            })
            ;(async () => {
                try {
                    const response = await promise
                    const { href } = response.data
                    const hash = href.match(/\/([a-f0-9]+)$/)?.[1]
                    if (!isHash(hash)) {
                        throw 500
                    }
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
    }, [buffer, contributorUUID, onComplete, token, type])
    if (error) {
        return (
            <Dialogue>
                <Speech mode="system">
                    <p>
                        <strong>Ack!</strong> There was some kind of error:
                    </p>
                    <p>“{String(error)}”</p>
                </Speech>
                <UserOptions>
                    <UserButton icon={ICON_ARROW_LEFT} onClick={onCancel}>
                        Start over.
                    </UserButton>
                </UserOptions>
            </Dialogue>
        )
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
