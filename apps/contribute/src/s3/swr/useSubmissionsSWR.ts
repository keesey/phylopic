import { EmailAddress, isEmailAddress, UUID } from "@phylopic/utils"
import { useCallback, useMemo } from "react"
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
export type Submissions = {
    readonly nextToken: string | null
    readonly uuids: readonly UUID[]
}
const useSubmissionsSWR = (emailAddress: EmailAddress | null) => {
    const getKey = useCallback<SWRInfiniteKeyLoader>(
        (index, previousPageData: Submissions | null) =>
            (index === 0 || previousPageData?.uuids.length) && isEmailAddress(emailAddress)
                ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}/submissions` +
                  (previousPageData?.nextToken ? `?token=${encodeURIComponent(previousPageData.nextToken)}` : "")
                : null,
        [emailAddress],
    )
    const fetcher = useAuthorizedJSONFetcher<Submissions>()
    return useSWRInfinite<Submissions>(getKey, fetcher)
}
export default useSubmissionsSWR
