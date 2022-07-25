import { createSearch, isUUID, UUID } from "@phylopic/utils"
import { useCallback } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { UUIDList } from "../models/UUIDList"
const useSubmissionsSWR = (contributorUUID: UUID | null) => {
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: UUIDList | null) =>
            (index === 0 || previousPageData?.uuids.length) && isUUID(contributorUUID)
                ? `/api/submissions` + createSearch({ token: previousPageData?.nextToken })
                : null,
        [contributorUUID],
    )
    const fetcher = useAuthorizedJSONFetcher<UUIDList>()
    return useSWRInfinite<UUIDList>(getKey, fetcher)
}
export default useSubmissionsSWR
