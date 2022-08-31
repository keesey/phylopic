import { UUID } from "@phylopic/utils"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmission = (uuid: UUID | undefined) => {
    const { data } = useSubmissionSWR(uuid)
    return data
}
export default useSubmission
