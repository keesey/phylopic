import { useCallback, useContext } from "react"
import putNode from "~/api/putNode"
import Context from "./Context"

const useSave = () => {
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state) {
            console.warn("Can't save.")
        } else {
            const entities =
                state.created.value.parent === state.original.uuid
                    ? [state.original, state.created]
                    : [state.created, state.original]
            for (const entity of entities) {
                await putNode(dispatch, entity.uuid, entity.value)
            }
        }
    }, [dispatch, state])
}
export default useSave
