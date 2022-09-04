import { useContext } from "react"
import AssignmentContext from "../AssignmentContext"
const useChangeRequested = () => {
    const context = useContext(AssignmentContext)
    return context?.[0]?.changeRequested ?? false
}
export default useChangeRequested
