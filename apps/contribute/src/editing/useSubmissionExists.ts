import { UUID } from "@phylopic/utils"
import useSubmissionSWR from "./useSubmissionSWR"
const useSubmissionExists = (uuid: UUID | undefined) => {
    const { data, error, isValidating } = useSubmissionSWR(uuid)
    if (error) {
        return undefined
    }
    if (!data) {
        return isValidating ? undefined : false
    }
    return true
}
export default useSubmissionExists
