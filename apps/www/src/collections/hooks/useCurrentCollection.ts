import { useContext } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useCurrentCollection = () => {
    const [state] = useContext(CollectionsContext)
    return state.collections[state.currentCollection]
}
export default useCurrentCollection
