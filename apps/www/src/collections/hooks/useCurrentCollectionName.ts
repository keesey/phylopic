import { useContext } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useCurrentCollectionName = () => {
    const [state] = useContext(CollectionsContext)
    return state.currentCollection
}
export default useCurrentCollectionName
