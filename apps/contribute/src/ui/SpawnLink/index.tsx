import { FC, ReactNode, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import clsx from "clsx"
import styles from "./index.module.scss"
import { isUUID, UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
export type Props = {
    children: ReactNode
}
const FETCHER_CONFIG = { method: "POST" }
const SpawnLink: FC<Props> = ({ children}) => {
    const [requested, setRequested] = useState(false)
    const fetcher = useAuthorizedJSONFetcher<{ uuid: UUID }>(FETCHER_CONFIG)
    const { data, error, isValidating } = useSWRImmutable(requested ? `/api/spawn`: null, fetcher)
    useEffect(() => {
        if (error) {
            alert(error)
        }
    }, [error])
    const router = useRouter()
    useEffect(() => {
        const uuid = data?.uuid
        if (isUUID(uuid)) {
            router.push(`/submissions/${encodeURIComponent(uuid)}`)
        }
    }, [data?.uuid])
    return (
        <a className={clsx("text", isValidating && styles.pending)} onClick={() => setRequested(true)}>{children}</a>
    )
}
export default SpawnLink
