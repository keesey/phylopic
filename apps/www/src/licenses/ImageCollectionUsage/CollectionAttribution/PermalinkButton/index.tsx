import { Hash, isHash, URL, UUIDish } from "@phylopic/utils"
import axios from "axios"
import { useRouter } from "next/router"
import { FC, ReactNode, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import styles from "./index.module.scss"
export interface Props {
    children: ReactNode
    uuid: UUIDish
}
const fetcher = (url: URL) => axios.get<Hash>(url)
const PermalinkButton: FC<Props> = ({ children, uuid }) => {
    const [requested, setRequested] = useState(false)
    const key = requested ? `/api/permalinks/collections/${encodeURIComponent(uuid)}` : null
    const { data, error, isValidating } = useSWRImmutable(key, fetcher)
    const errorMessage = error ? String(error) : undefined
    useEffect(() => {
        if (errorMessage) {
            alert("There was an error creating the permalink.")
            setRequested(false)
        }
    }, [errorMessage])
    const { data: hash } = data ?? {}
    const router = useRouter()
    useEffect(() => {
        if (isHash(hash)) {
            void router.push(`/permalinks/${encodeURIComponent(hash)}`)
        }
    }, [hash, router])
    return (
        <a
            aria-disabled={isValidating}
            className={isValidating ? styles.pending : undefined}
            onClick={() => setRequested(true)}
            role="button"
        >
            {children}
        </a>
    )
}
export default PermalinkButton
