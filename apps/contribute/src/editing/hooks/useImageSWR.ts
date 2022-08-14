import { Image } from "@phylopic/source-models"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import useImageUUID from "./useImageUUID"
const useImageSWR = () => {
    const uuid = useImageUUID()
    const key = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}` : null), [uuid])
    const fetcher = useAuthorizedJSONFetcher()
    return useSWR<Image>(key, fetcher)
}
export default useImageSWR
