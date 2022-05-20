import { useCallback, useContext } from "react"
import putSubmission from "~/api/putSubmission"
import Context from "./Context"

const useSave = () => {
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state?.uuid || state.pending || !state.modified.contribution) {
            console.warn("Can't save.")
        } else {
            await putSubmission(dispatch, state.uuid, state.modified.contribution, state.original.contribution)
        }
    }, [dispatch, state?.modified.contribution, state?.original.contribution, state?.pending, state?.uuid])
}
export default useSave
