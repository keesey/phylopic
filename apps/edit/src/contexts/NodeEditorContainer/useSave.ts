import { useCallback, useContext } from "react"
import putNode from "~/api/putNode"
import Context from "./Context"

const useSave = () => {
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state?.uuid || state.pending || !state.modified.node) {
            console.warn("Can't save.")
        } else {
            await putNode(dispatch, state.uuid, state.modified.node, state.original.node)
        }
    }, [dispatch, state?.modified.node, state?.original.node, state?.pending, state?.uuid])
}
export default useSave
