import { Hash } from "@phylopic/utils"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionExists = (hash: Hash | undefined) => {
    const { data, error, isValidating } = useSubmissionSWR(hash)
    if (error) {
        return undefined
    }
    if (!data) {
        return isValidating ? undefined : false
    }
    return true
}
export default useSubmissionExists
