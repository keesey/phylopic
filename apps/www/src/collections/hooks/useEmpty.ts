import { useContext } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useEmpty = () => {
    const [state] = useContext(CollectionsContext)
    return Object.keys(state.collections).length === 0
}
export default useEmpty
