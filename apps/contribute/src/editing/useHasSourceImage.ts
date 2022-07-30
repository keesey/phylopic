import { UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedExistenceFetcher from "~/auth/hooks/useAuthorizedExistenceFetcher"
const useHasSourceImage = (uuid: UUID) => {
    const sourceKey = useMemo(() => (uuid ? `/api/images/${encodeURIComponent(uuid)}` : null), [uuid])
    const fetchExistence = useAuthorizedExistenceFetcher()
    const { data } = useSWR(sourceKey, fetchExistence, {
        errorRetryInterval: 60 * 1000,
    })
    return data
}
export default useHasSourceImage
