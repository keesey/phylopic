import { EmailAddress, isEmailAddress, UUID } from "@phylopic/utils"
import { useMemo } from "react"
import useSWR from "swr"
import useAuthorizedJSONFetcher from "~/auth/hooks/useAuthorizedJSONFetcher"
export type ContributorMeta = {
    readonly uuid: UUID
}
const useContributorMetaSWR = (emailAddress: EmailAddress | null) => {
    const key = useMemo(
        () =>
            isEmailAddress(emailAddress) ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}` : null,
        [emailAddress],
    )
    const fetcher = useAuthorizedJSONFetcher<ContributorMeta>()
    return useSWR<ContributorMeta>(key, fetcher)
}
export default useContributorMetaSWR
