import { useContext } from "react"
import { default as AssignmentContext } from "../AssignmentContext"
const useDispatch = () => {
    const context = useContext(AssignmentContext)
    return context?.[1]
}
export default useDispatch
