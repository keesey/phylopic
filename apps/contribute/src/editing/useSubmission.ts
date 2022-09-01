import { Hash } from "@phylopic/utils"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmission = (hash: Hash | undefined) => useSubmissionSWR(hash).data
export default useSubmission
