import { UUID } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const FETCHER_CONFIG = { method: "POST" }
const useImageSpawn = () => {
    const [requested, setRequested] = useState(false)
    const fetcher = useAuthorizedJSONFetcher<{ existing: boolean; uuid: UUID }>(FETCHER_CONFIG)
    const { data, error, isValidating } = useSWRImmutable(requested ? `/api/spawn` : null, fetcher)
    const router = useRouter()
    useEffect(() => {
        if (data) {
            router.push(`/edit/${encodeURIComponent(data.uuid)}${data.existing ? "" : "/file"}`)
        }
    }, [data])
    const spawn = useCallback(() => setRequested(true), [])
    return [spawn, error, isValidating] as Readonly<[() => void, any, boolean]>
}
export default useImageSpawn
