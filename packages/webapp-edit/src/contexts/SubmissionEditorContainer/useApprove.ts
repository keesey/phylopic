import { useRouter } from "next/router"
import { useCallback, useContext } from "react"
import approveSubmission from "~/api/approveSubmission"
import Context from "./Context"

const useApprove = () => {
    const router = useRouter()
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state?.uuid || state.pending || !state.modified.contribution) {
            console.warn("Can't approve.")
        } else {
            await approveSubmission(dispatch, state.uuid, state.modified.contribution, state.original.contribution)
            await router.push(`/images/${state?.uuid}`)
        }
    }, [dispatch, router, state?.modified.contribution, state?.original.contribution, state?.pending, state?.uuid])
}
export default useApprove
