import { Identifier } from "@phylopic/utils"
import { useRouter } from "next/router"
import { useCallback } from "react"
import useSubmissionMutator from "~/editing/useSubmissionMutator"
import useDispatch from "./useDispatch"
import useSubmissionHash from "./useSubmissionHash"
const useComplete = () => {
    const dispatch = useDispatch()
    const hash = useSubmissionHash()
    const mutate = useSubmissionMutator(hash)
    const router = useRouter()
    return useCallback(
        async (identifier: Identifier, newTaxonName: string | null) => {
            if (hash) {
                dispatch?.({ type: "SET_PENDING", payload: true })
                await mutate({ identifier, newTaxonName })
                await router.push(`/edit/${encodeURIComponent(hash)}`)
            }
        },
        [dispatch, hash, mutate, router],
    )
}
export default useComplete
