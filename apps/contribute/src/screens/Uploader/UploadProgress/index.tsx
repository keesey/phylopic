import { UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useContext, useEffect, useState } from "react"
import AuthContext from "~/auth/AuthContext"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import DialogueScreen from "~/pages/screenTypes/DialogueScreen"
import getSubmissionSourceKey from "~/s3/keys/submissions/getSubmissionSourceKey"
export interface Props {
    buffer: Buffer
    onComplete?: (uuid: UUID) => void
    type: string
    uuid: UUID
}
const UploadProgress: FC<Props> = ({ buffer, onComplete, type, uuid }) => {
    const contributorUUID = useContributorUUID()
    const [token] = useContext(AuthContext) ?? []
    const [loaded, setLoaded] = useState(0)
    const [total, setTotal] = useState(NaN)
    const [error, setError] = useState<Error | undefined>()
    useEffect(() => {
        if (buffer && contributorUUID && token) {
            const controller = new AbortController()
            const promise = axios.put<void>("/api/" + getSubmissionSourceKey(contributorUUID, uuid), buffer, {
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
                    setError(e as Error)
                }
            })()
            return () => controller.abort()
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
    return (
        <DialogueScreen>
            <section>
                <p>Uploading your image…</p>
                <progress value={loaded} max={total} />
            </section>
        </DialogueScreen>
    )
}
export default UploadProgress
