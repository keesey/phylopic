import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedImgSrcFetcher from "~/auth/hooks/useAuthorizedImgSrcFetcher"
import useImageUUID from "./useImageUUID"
const useImageSrcSWR = () => {
    const uuid = useImageUUID()
    const key = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}/source` : null), [uuid])
    const fetcher = useAuthorizedImgSrcFetcher()
    return useSWR(key, fetcher)
}
export default useImageSrcSWR
