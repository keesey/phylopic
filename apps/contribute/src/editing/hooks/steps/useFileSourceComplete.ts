import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
const useFileSourceComplete = (uuid: UUID | undefined) => {
    const url = uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null
    const key = useMemo(() => (url ? { url, method: "HEAD" } : null), [url])
    const fetcher = useAuthorizedExistenceFetcher()
    const { data } = useSWR(key, fetcher)
    return data
}
export default useFileSourceComplete
