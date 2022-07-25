import { useCallback } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorized from "~/auth/hooks/useAuthorized"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { UUIDList } from "../models/UUIDList"
const useImagesSWR = () => {
    const authorized = useAuthorized()
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: UUIDList | null) =>
            authorized && (index === 0 || previousPageData?.uuids.length)
                ? `/api/images` +
                  (previousPageData?.nextToken ? `?token=${encodeURIComponent(previousPageData.nextToken)}` : "")
                : null,
        [authorized],
    )
    const fetcher = useAuthorizedJSONFetcher<UUIDList>()
    return useSWRInfinite<UUIDList>(getKey, fetcher)
}
export default useImagesSWR
