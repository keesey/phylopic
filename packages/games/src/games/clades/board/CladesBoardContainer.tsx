import type { UUID } from "@phylopic/utils"
import React from "react"
import { trimImage } from "../generate/trimImage"
import { CladesBoardState } from "./CladesBoardState"
import { CladesGameAction, CladesGameInitializeAction, CladesGameLossAction, CladesGameWinAction } from "./actions"
import reducer from "./reducer"
import { cladesGameSelect } from "./cladesGameSelect"
export type CladesGameSubmission = ReadonlySet<UUID>
export type CladesBoardContainerProps = React.PropsWithChildren<{
    data: CladesGameInitializeAction["payload"]
    onError: (e: unknown) => void
    onSubmit: (submission: CladesGameSubmission) => Promise<CladesGameLossAction | CladesGameWinAction>
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
    totalAnswers: 0,
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
    const imagesPerAnswer = cladesGameSelect.imagesPerAnswer(state)
    React.useEffect(() => {
        if (submission.size === imagesPerAnswer) {
            ;(async () => {
                try {
                    dispatch(await onSubmit(submission))
                } catch (e) {
                    dispatch({ type: "SUBMIT_CANCEL" })
                    onError(e)
                }
            })()
        }
    }, [dispatch, imagesPerAnswer, submission])
    return <CladesBoardContext.Provider value={contextValue}>{children}</CladesBoardContext.Provider>
}
