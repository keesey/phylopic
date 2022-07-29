import { ImageMediaType, UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useEffect, useState } from "react"
import useAuthToken from "~/auth/hooks/useAuthToken"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
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
            const promise = axios.put<void>(
                `/api/submissions/${encodeURIComponent(uuid)}/source/${encodeURIComponent(contributorUUID)}`,
                buffer,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                        "content-type": type,
                    },
                    onUploadProgress: (event: ProgressEvent) => {
                        setLoaded(event.loaded)
                        setTotal(event.total)
                    },
                    signal: controller.signal,
                },
            )
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
        } else {
            console.debug("NOT READY TO UPLOAD", buffer, token, uuid)
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
                    {/* :TODO: button */}
                </section>
            </DialogueScreen>
        )
    }
    if (!buffer || !token || !uuid) {
        ;<DialogueScreen>
            <section>
                <p>Unknown error.</p>
                <pre>1. {buffer}</pre>
                <pre>2. {token}</pre>
                <pre>3. {uuid}</pre>
            </section>
        </DialogueScreen>
    }
    return (
        <DialogueScreen>
            <section>
                <p>Uploading your image…</p>
                <progress value={loaded} max={isNaN(total) ? undefined : total} />
            </section>
        </DialogueScreen>
    )
}
export default UploadProgress
