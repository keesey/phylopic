import { useContext, useMemo } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useCollectionNames = () => {
    const [state] = useContext(CollectionsContext)
    return useMemo(() => Object.keys(state.collections).sort(), [state.collections])
}
export default useCollectionNames
