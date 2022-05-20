import { useCallback, useContext } from "react"
import putImage from "~/api/putImage"
import Context from "./Context"

const useSave = () => {
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state?.uuid || state.pending || !state.modified.image) {
            console.warn("Can't save.")
        } else {
            await putImage(dispatch, state.uuid, state.modified.image, state.original.image)
        }
    }, [dispatch, state?.modified.image, state?.original.image, state?.pending, state?.uuid])
}
export default useSave
