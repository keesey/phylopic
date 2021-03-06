import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import { useCallback } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
import { UUIDList } from "../models/UUIDList"
const useSubmissionsSWR = (emailAddress: EmailAddress | null) => {
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: UUIDList | null) =>
            (index === 0 || previousPageData?.uuids.length) && isEmailAddress(emailAddress)
                ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}/submissions` +
                  (previousPageData?.nextToken ? `?token=${encodeURIComponent(previousPageData.nextToken)}` : "")
                : null,
        [emailAddress],
    )
    const fetcher = useAuthorizedJSONFetcher<UUIDList>()
    return useSWRInfinite<UUIDList>(getKey, fetcher)
}
export default useSubmissionsSWR
