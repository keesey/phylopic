import useSubmissionMutator from "~/editing/useSubmissionMutator"
import useSubmissionHash from "./useSubmissionHash"
const useAssignmentSubmissionMutator = () => {
    const hash = useSubmissionHash()
    return useSubmissionMutator(hash)
}
export default useAssignmentSubmissionMutator
