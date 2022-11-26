import { useContext } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useCurrentCollection = () => {
    const [state] = useContext(CollectionsContext)
    return state.currentCollection ? state.collections[state.currentCollection] : null
}
export default useCurrentCollection
