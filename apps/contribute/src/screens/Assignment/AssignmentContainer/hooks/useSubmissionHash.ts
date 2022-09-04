import { useContext } from "react"
import AssignmentContext from "../AssignmentContext"
const useSubmissionHash = () => {
    const context = useContext(AssignmentContext)
    return context?.[0]?.hash
}
export default useSubmissionHash
