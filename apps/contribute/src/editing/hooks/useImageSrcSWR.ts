import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedImgSrcFetcher from "~/auth/hooks/useAuthorizedImgSrcFetcher"
const useImageSrcSWR = (uuid?: UUID) => {
    const key = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null), [uuid])
    const fetcher = useAuthorizedImgSrcFetcher()
    return useSWR(key, fetcher, {
        refreshInterval: 120 * 60 * 1000,
    })
}
export default useImageSrcSWR
