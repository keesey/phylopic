import { isNode, Node } from "@phylopic/source-models"
import { stringifyNormalized, UUID } from "@phylopic/utils"
import { Dispatch } from "react"
import { SaveAction } from "~/contexts/SaveAction"

const putNode = async (dispatch: Dispatch<SaveAction>, uuid: UUID, modified: Node, original?: Node) => {
    dispatch({ type: "START_SAVE" })
    try {
        if (!isNode(modified)) {
            throw new Error("Not a valid node.")
        }
        const body = stringifyNormalized(modified)
        if (original && body === stringifyNormalized(original)) {
            return dispatch({ type: "COMPLETE_SAVE" })
        }
        const result = await fetch(`/api/nodes/${uuid}`, {
            method: "PUT",
            body,
            headers: {
                "content-type": "application/json",
            },
        })
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
export default putNode
