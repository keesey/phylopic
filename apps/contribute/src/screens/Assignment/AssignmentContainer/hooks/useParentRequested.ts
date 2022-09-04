import { useContext } from "react"
import AssignmentContext from "../AssignmentContext"
const useParentRequested = () => {
    const context = useContext(AssignmentContext)
    return context?.[0]?.parentRequested ?? false
}
export default useParentRequested
