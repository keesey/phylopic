import { Contribution, isContribution } from "@phylopic/source-models"
import { stringifyNormalized, UUID } from "@phylopic/utils"
import { Dispatch } from "react"
import { SaveAction } from "~/contexts/SaveAction"

const putSubmission = async (
    dispatch: Dispatch<SaveAction>,
    uuid: UUID,
    modified: Contribution,
    original?: Contribution,
) => {
    dispatch({ type: "START_SAVE" })
    try {
        if (!isContribution(modified)) {
            throw new Error("Not a valid contribution.")
        }
        if (original && original.contributor !== modified.contributor) {
            throw new Error("Cannot change contributor.")
        }
        const body = stringifyNormalized(modified)
        if (original && body === stringifyNormalized(original)) {
            return dispatch({ type: "COMPLETE_SAVE" })
        }
        const result = await fetch(
            `/api/submissions/${encodeURIComponent(modified.contributor)}/${encodeURIComponent(uuid)}`,
            {
                method: "PUT",
                body,
                headers: {
                    "content-type": "application/json",
                },
            },
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
    }
}
export default putSubmission
