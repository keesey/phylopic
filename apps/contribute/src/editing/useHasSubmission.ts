import { UUID } from "@phylopic/utils"
import useContributorUUID from "~/auth/hooks/useContributorUUID"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
const useHasSubmission = (uuid: UUID) => {
    const contributorUUID = useContributorUUID()
    const { data } = useSubmissionSWR(uuid)
    return Boolean(data)
}
export default useHasSubmission
