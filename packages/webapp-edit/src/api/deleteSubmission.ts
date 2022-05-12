import { EmailAddress, UUID } from "@phylopic/utils"
import { Dispatch } from "react"
import { SaveAction } from "~/contexts/SaveAction"

const deleteSubmission = async (dispatch: Dispatch<SaveAction>, contributor: EmailAddress, uuid: UUID) => {
    dispatch({ type: "START_SAVE" })
    try {
        const result = await fetch(`/api/submissions/${encodeURIComponent(contributor)}/${encodeURIComponent(uuid)}`, {
            method: "DELETE",
        })
        if (!result.ok) {
            throw new Error(result.statusText)
        }
        const result2 = await fetch(
            `/api/submissionfiles/${encodeURIComponent(contributor)}/${encodeURIComponent(uuid)}`,
            { method: "DELETE" },
        )
        if (!result2.ok) {
            throw new Error(result2.statusText)
        }
        dispatch({ type: "COMPLETE_SAVE" })
    } catch (e) {
        dispatch({
            error: true,
            payload: e instanceof Error ? e : new Error(String(e)),
            type: "FAIL_SAVE",
        })
        throw e
    }
}
export default deleteSubmission
