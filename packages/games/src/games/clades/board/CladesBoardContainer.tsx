import type { UUID } from "@phylopic/utils"
import React from "react"
import { CladesGameNode } from "../generate"
import { CladesBoardState } from "./CladesBoardState"
import { CladesGameAction, CladesGameInitializeAction } from "./actions"
import reducer from "./reducer"
import { trimNode } from "../generate/trimNode"
import { trimImage } from "../generate/trimImage"
export type CladesGameSubmission = ReadonlySet<UUID>
export type CladesGameVerdict = Readonly<{ discrepancy: number; type: "loss" } | { node: CladesGameNode; type: "win" }>
export type CladesBoardContainerProps = React.PropsWithChildren<{
    data: CladesGameInitializeAction["payload"]
    onError: (e: unknown) => void
    onSubmit: (submission: CladesGameSubmission) => Promise<CladesGameVerdict>
}>
export const CladesBoardContext = React.createContext<
    Readonly<[CladesBoardState, React.Dispatch<CladesGameAction>]> | undefined
>(undefined)
const DEFAULT_STATE: CladesBoardState = {
    answers: [],
    discrepancy: null,
    images: {},
    imageUUIDs: [],
    mistakes: 0,
    numSets: 0,
}
export const CladesBoardContainer: React.FC<CladesBoardContainerProps> = ({ children, data, onError, onSubmit }) => {
    const contextValue = React.useReducer(reducer, DEFAULT_STATE)
    const [state, dispatch] = contextValue
    React.useEffect(() => {
        dispatch({ type: "INITIALIZE", payload: { ...data, images: data.images.map(image => trimImage(image)) } })
    }, [data, dispatch])
    const submission = React.useMemo(
        () =>
            new Set(
                Object.values(state.images)
                    .filter(value => value.mode === "submitted")
                    .map(value => value.image.uuid),
            ),
        [state.images],
    )
    React.useEffect(() => {
        if (submission.size === 4) {
            ;(async () => {
                try {
                    const response = await onSubmit(submission)
                    if (response.type === "loss") {
                        dispatch({ type: "LOSS", payload: response.discrepancy })
                    } else if (response.type === "win") {
                        dispatch({ type: "WIN", payload: trimNode(response.node) })
                    } else {
                        throw new Error("Unknown response type.")
                    }
                } catch (e) {
                    dispatch({ type: "SUBMIT_CANCEL" })
                    onError(e)
                }
            })()
        }
    }, [submission])
    return <CladesBoardContext.Provider value={contextValue}>{children}</CladesBoardContext.Provider>
}
