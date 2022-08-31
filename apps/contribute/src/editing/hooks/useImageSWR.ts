import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWRImmutable from "swr/immutable"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
const useImageSWR = (uuid: UUID | undefined) => {
    const key = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}` : null), [uuid])
    const fetcher = useAuthorizedJSONFetcher<Image & { uuid: UUID }>()
    return useSWRImmutable(key, fetcher)
}
export default useImageSWR
