import { UUID } from "@phylopic/utils"
import axios from "axios"
import { FC, useContext, useEffect, useState } from "react"
import { v4 } from "uuid"
import AuthContext from "~/auth/AuthContext"
import useEmailAddress from "~/auth/hooks/useEmailAddress"
export interface Props {
    buffer: Buffer
    onComplete?: (uuid: UUID) => void
    type: string
}
const UploadProgress: FC<Props> = ({ buffer, onComplete, type }) => {
    const emailAddress = useEmailAddress()
    const [token] = useContext(AuthContext) ?? []
    const [loaded, setLoaded] = useState(0)
    const [total, setTotal] = useState(NaN)
    const [error, setError] = useState<Error | undefined>()
    useEffect(() => {
        if (buffer && emailAddress && token) {
            const uuid = v4()
            const controller = new AbortController()
            const promise = axios.put<void>(`/api/imagefiles/${encodeURIComponent(uuid)}`, buffer, {
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
    }, [buffer, emailAddress, onComplete, token, type])
    if (error) {
        return (
            <section>
                <p>
                    <strong>Ack!</strong> There was some kind of error:
                </p>
                <p>&ldquo;{String(error)}&rdquo;</p>
                {/* :TODO: button */}
            </section>
        )
    }
    return (
        <section>
            <p>Uploading your image&hellip;</p>
            <progress value={loaded} max={total} />
        </section>
    )
}
export default UploadProgress
