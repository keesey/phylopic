import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
const useImageHasSourceFile = (uuid: UUID | undefined) => {
    const url = uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null
    const key = useMemo(() => (url ? { method: "HEAD", url } : null), [url])
    const fetcher = useAuthorizedExistenceFetcher()
    const { data } = useSWR(key, fetcher)
    return data
}
export default useImageHasSourceFile
