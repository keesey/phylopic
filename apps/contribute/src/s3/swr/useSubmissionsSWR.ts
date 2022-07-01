import { EmailAddress, isEmailAddress, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
export type Submissions = {
    readonly nextToken: string | null
    readonly uuids: readonly UUID[]
}
const useSubmissionsSWR = (emailAddress: EmailAddress | null) => {
    const key = useMemo(
        () =>
            isEmailAddress(emailAddress)
                ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}/submissions`
                : null,
        [emailAddress],
    )
    const fetcher = useAuthorizedJSONFetcher<Submissions>()
    return useSWR<Submissions>(key, fetcher)
}
export default useSubmissionsSWR
