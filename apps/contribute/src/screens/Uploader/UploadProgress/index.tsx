import { ImageMediaType, UUID } from "@phylopic/utils"
import axios from "axios"
import Link from "next/link"
import { FC, useEffect, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import useContributorUUID from "~/profile/useContributorUUID"
import ButtonNav from "~/ui/ButtonNav"
import styles from "./index.module.scss"
export interface Props {
    buffer: Buffer
    onComplete?: (uuid: UUID) => void
    type: ImageMediaType
    uuid: UUID
}
const UploadProgress: FC<Props> = ({ buffer, onComplete, type, uuid }) => {
    const token = useAuthToken()
    const contributorUUID = useContributorUUID()
    const [loaded, setLoaded] = useState(0)
    const [total, setTotal] = useState(NaN)
    const [error, setError] = useState<Error | undefined>()
    useEffect(() => {
        if (buffer && contributorUUID && token && uuid) {
            const controller = new AbortController()
            const promise = axios.put<void>(`/api/images/${encodeURIComponent(uuid)}/source`, buffer, {
                headers: {
                    authorization: `Bearer ${token}`,
                    "content-type": type,
                },
                onUploadProgress: (event: ProgressEvent) => {
                    setLoaded(event.loaded)
                    setTotal(event.total)
                },
                signal: controller.signal,
            })
            ;(async () => {
                try {
                    await promise
                    onComplete?.(uuid)
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
    }, [buffer, contributorUUID, onComplete, token, type, uuid])
    if (error) {
        return (
            <DialogueScreen>
                <section>
                    <p>
                        <strong>Ack!</strong> There was some kind of error:
                    </p>
                    <p>“{String(error)}”</p>
                    <ButtonNav mode="horizontal">
                        <Link href={`/edit/${encodeURIComponent(uuid)}`}>
                            <button className="cta">Start over.</button>
                        </Link>
                    </ButtonNav>
                    {/* :TODO: button */}
                </section>
            </DialogueScreen>
        )
    }
    return (
        <DialogueScreen>
            <section>
                <p>Uploading your image…</p>
                <progress className={styles.progress} value={loaded} max={isNaN(total) ? undefined : total} />
            </section>
        </DialogueScreen>
    )
}
export default UploadProgress
