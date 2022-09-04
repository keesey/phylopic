import { useContext } from "react"
import AssignmentContext from "../AssignmentContext"
const usePending = () => {
    const context = useContext(AssignmentContext)
    return context?.[0]?.pending ?? false
}
export default usePending
