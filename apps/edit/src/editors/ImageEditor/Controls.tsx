import { Image, isSubmittableImage } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useEffect, useMemo } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import useDeletor from "~/swr/useDeletor"
import usePatcher from "~/swr/usePatcher"
import styles from "./Controls.module.scss"
export type Props = {
    uuid: UUID
}
const Controls: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data, error } = response
    const patcher = usePatcher(key, response)
    const deletor = useDeletor(key, response)
    const submittable = useMemo(() => isSubmittableImage(data), [data])
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const router = useRouter()
    return (
        <nav className={styles.main}>
            {data && !data.accepted && data.submitted && (
                <button onClick={() => patcher({ accepted: true })}>Accept</button>
            )}
            {data && data.accepted && data.submitted && (
                <button onClick={() => router.push("/images?filter=submitted")}>View Submissions</button>
            )}
            {data && !data.accepted && !data.submitted && submittable && (
                <button onClick={() => patcher({ accepted: true, submitted: true })}>Submit and Accept</button>
            )}
            {data && data.accepted && !data.submitted && <button onClick={deletor}>Delete</button>}
        </nav>
    )
}
export default Controls
