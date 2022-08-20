import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useImageSWR = (uuid: UUID | undefined) => {
    const key = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}` : null), [uuid])
    const fetcher = useAuthorizedJSONFetcher<Image>()
    return useSWR(key, fetcher)
}
export default useImageSWR
