import useSubmission from "~/editing/useSubmission"
import useSubmissionHash from "./useSubmissionHash"
const useAssignmentSubmission = () => {
    const hash = useSubmissionHash()
    return useSubmission(hash)
}
export default useAssignmentSubmission
