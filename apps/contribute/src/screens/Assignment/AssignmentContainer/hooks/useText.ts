import { useContext } from "react"
import AssignmentContext from "../AssignmentContext"
const useText = () => {
    const context = useContext(AssignmentContext)
    return context?.[0]?.text ?? ""
}
export default useText
