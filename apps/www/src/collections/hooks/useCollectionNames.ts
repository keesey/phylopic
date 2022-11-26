import { compareStrings } from "@phylopic/utils"
import { useContext, useMemo } from "react"
import CollectionsContext from "../context/CollectionsContext"
const useCollectionNames = () => {
    const [state] = useContext(CollectionsContext)
    return useMemo(
        () => Object.keys(state.collections).sort(compareStrings),
        [state.collections, state.currentCollection],
    )
}
export default useCollectionNames
