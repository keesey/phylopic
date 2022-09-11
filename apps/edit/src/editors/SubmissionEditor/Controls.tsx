import { Page } from "@phylopic/source-client"
import { Submission } from "@phylopic/source-models"
import { fetchJSON } from "@phylopic/ui"
import { Hash, UUID } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { FC, useCallback, useMemo } from "react"
import useSWR from "swr"
import useDeletor from "~/swr/useDeletor"
import styles from "./Controls.module.scss"
export type Props = {
    hash: Hash
}
const Controls: FC<Props> = ({ hash }) => {
    const key = `/api/submissions/_/${encodeURIComponent(hash)}`
    const response = useSWR<Submission>(key, fetchJSON)
    const { mutate: mutateList } = useSWR<Page<Submission, string>>("/api/submissions", fetchJSON)
    const { data, mutate } = response
    const mutators = useMemo(() => [mutate, mutateList], [mutate, mutateList])
    const deletor = useDeletor(key, response, mutators, "/submissions")
    const router = useRouter()
    const handleAcceptClick = useCallback(async () => {
        let uuid: UUID
        try {
            const response = await axios.post<{ uuid: UUID }>(key)
            uuid = response.data.uuid
        } catch (e) {
            alert(String(e))
            return
        }
        mutate(undefined, { revalidate: true })
        mutateList(undefined, { revalidate: true })
        router.push(`/images/${encodeURIComponent(uuid)}`)
    }, [key, mutate, mutateList, router])
    const handleDeleteClick = useCallback(() => {
        if (confirm("Are you sure you want to delete this?")) {
            deletor()
        }
    }, [deletor])
    return (
        <nav className={styles.main}>
            {data && data.status === "submitted" && <button onClick={handleAcceptClick}>Accept</button>}
            {data && (
                <button className={styles.danger} onClick={handleDeleteClick}>
                    Delete
                </button>
            )}
        </nav>
    )
}
export default Controls
