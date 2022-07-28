import { UUID } from "@phylopic/utils"
import useSubmissionSWR from "~/s3/swr/useSubmissionSWR"
const useCreationComplete = (uuid: UUID) => {
    const submission = useSubmissionSWR(uuid)
    return Boolean(submission.data?.created)
}
export default useCreationComplete
