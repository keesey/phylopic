import { ImageMediaType, UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useContext, useEffect, useState } from "react"
import AuthContext from "~/auth/AuthContext"
import useAuthToken from "~/auth/hooks/useAuthToken"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
export interface Props {
    buffer: Buffer
    onComplete?: (uuid: UUID) => void
    type: ImageMediaType
    uuid: UUID
}
const UploadProgress: FC<Props> = ({ buffer, onComplete, type, uuid }) => {
    const token = useAuthToken()
    const [loaded, setLoaded] = useState(0)
    const [total, setTotal] = useState(NaN)
    const [error, setError] = useState<Error | undefined>()
    useEffect(() => {
        if (buffer && token && uuid) {
            console.debug("READY TO UPLOAD")
            const controller = new AbortController()
            const promise = axios.put<void>(`/api/submissions/${encodeURIComponent(uuid)}/source`, buffer, {
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
            console.debug({
                authorization: `Bearer ${token}`,
                "content-type": type,
            })
            ;(async () => {
                try {
                    console.debug("UPLOAD STARTED!")
                    await promise
                    console.debug("UPLOAD COMPLETE!")
                    onComplete?.(uuid)
                } catch (e) {
                    if (e instanceof Error && !axios.isCancel(e)) {
                        setError(e)
                    }
                }
            })()
            return () => controller.abort()
        } else {
            console.debug("NOT READY TO UPLOAD", buffer, token, uuid)
        }
    }, [buffer, onComplete, token, type, uuid])
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
