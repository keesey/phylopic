import { useRouter } from "next/router"
import { useCallback, useContext } from "react"
import deleteSubmission from "~/api/deleteSubmission"
import Context from "./Context"

const useDelete = () => {
    const router = useRouter()
    const [state, dispatch] = useContext(Context) ?? []
    return useCallback(async () => {
        if (!dispatch || !state?.uuid || state.pending) {
            console.warn("Can't delete.")
        } else if (confirm("Are you sure you want to permanently delete this submission?")) {
            await deleteSubmission(dispatch, state.original.contribution.contributor, state.uuid)
            await router.push("/submissions")
        }
    }, [dispatch, router, state?.pending, state?.uuid, state?.original.contribution.contributor])
}
export default useDelete
