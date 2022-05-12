import { Contribution, isContribution } from "@phylopic/source-models"
import { stringifyNormalized, UUID } from "@phylopic/utils"
import { Dispatch } from "react"
import { SaveAction } from "~/contexts/SaveAction"

const approveSubmission = async (
    dispatch: Dispatch<SaveAction>,
    uuid: UUID,
    modified: Contribution,
    original?: Contribution,
) => {
    dispatch({ type: "START_SAVE" })
    try {
        if (!isContribution(modified)) {
            throw new Error("Invalid contribution.")
        }
        if (original && original.contributor !== modified.contributor) {
            throw new Error("Cannot change contributor.")
        }
        const body = stringifyNormalized(modified)
        if (!original || body !== stringifyNormalized(original)) {
            const putResult = await fetch(
                `/api/submissions/${encodeURIComponent(modified.contributor)}/${encodeURIComponent(uuid)}`,
                {
                    method: "PUT",
                    body,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            )
            if (!putResult.ok) {
                throw new Error(putResult.statusText)
            }
        }
        const result = await fetch(
            `/api/submissions/${encodeURIComponent(modified.contributor)}/${encodeURIComponent(uuid)}/approve`,
            { method: "POST" },
        )
        if (!result.ok) {
            throw new Error(result.statusText)
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
export default approveSubmission
