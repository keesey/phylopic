import { useContext, useMemo } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useEmpty = () => {
    const [state] = useContext(CollectionsContext)
    return useMemo(
        () => Object.keys(state.entities).length === 0 && Object.keys(state.collections).length === 1,
        [state.collections, state.entities],
    )
}
export default useEmpty
