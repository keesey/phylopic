import { useContext } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useOpen = () => {
    const [state] = useContext(CollectionsContext)
    return state.open
}
export default useOpen
