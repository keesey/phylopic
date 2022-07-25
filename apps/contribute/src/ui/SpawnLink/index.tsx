import { UUID } from "@phylopic/utils"
import clsx from "clsx"
import { useRouter } from "next/router"
import { FC, ReactNode, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import styles from "./index.module.scss"
export type Props = {
    children: ReactNode
}
const FETCHER_CONFIG = { method: "POST" }
const SpawnLink: FC<Props> = ({ children }) => {
    const [requested, setRequested] = useState(false)
    const fetcher = useAuthorizedJSONFetcher<{ uuid: UUID }>(FETCHER_CONFIG)
    const { data, error, isValidating } = useSWRImmutable<{ existing: Boolean; uuid: UUID }>(
        requested ? `/api/spawn` : null,
        fetcher,
    )
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const router = useRouter()
    useEffect(() => {
        if (data) {
            router.push(`/edit/${encodeURIComponent(data.uuid)}${data.existing ? "" : "/file"}`)
        }
    }, [data])
    return (
        <a className={clsx("text", isValidating && styles.pending)} onClick={() => setRequested(true)}>
            {children}
        </a>
    )
}
export default SpawnLink
