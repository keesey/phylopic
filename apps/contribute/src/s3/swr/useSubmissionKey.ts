import { EmailAddress, isEmailAddress, isUUID, UUID } from "@phylopic/utils"
import { useMemo } from "react"
const useSubmissionKey = (emailAddress: EmailAddress | null, uuid: UUID | null) => {
    return useMemo(
        () =>
            isEmailAddress(emailAddress) && isUUID(uuid)
                ? `/api/s3/contribute/contributors/${encodeURIComponent(emailAddress)}/submissions/${encodeURIComponent(
                      uuid,
                  )}`
                : null,
        [emailAddress, uuid],
    )
}
export default useSubmissionKey
