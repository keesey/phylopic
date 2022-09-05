import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { FC, useEffect } from "react"
import useSWR from "swr"
import fetchJSON from "~/fetch/fetchJSON"
import useDeletor from "~/swr/useDeletor"
import styles from "./Controls.module.scss"
export type Props = {
    uuid: UUID
}
const Controls: FC<Props> = ({ uuid }) => {
    const key = `/api/images/_/${encodeURIComponent(uuid)}`
    const response = useSWR<Image & { uuid: UUID }>(key, fetchJSON)
    const { data, error } = response
    // :TODO: confirm
    const deletor = useDeletor(key, response, [], "/images")
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const router = useRouter()
    return (
        <nav className={styles.main}>
            {data && <button onClick={deletor}>Delete</button>}
        </nav>
    )
}
export default Controls
