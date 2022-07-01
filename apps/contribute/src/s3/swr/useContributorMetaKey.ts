import { EmailAddress, isEmailAddress } from "@phylopic/utils"
import { useMemo } from "react"
const useContributorMetaKey = (emailAddress: EmailAddress | null) => {
    return useMemo(
        () =>
            isEmailAddress(emailAddress) ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}` : null,
        [emailAddress],
    )
}
export default useContributorMetaKey
