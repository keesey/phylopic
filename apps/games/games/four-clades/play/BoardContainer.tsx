"use client"
import type { UUID } from "@phylopic/utils"
import { PropsWithChildren, createContext, useEffect, useMemo, useReducer } from "react"
import { trimImage } from "./trimImage"
import { BoardState } from "./BoardState"
import { Action, InitializeAction, LossAction, WinAction } from "./actions"
import reducer from "./reducer"
import { select } from "./select"
export type Submission = ReadonlySet<UUID>
export type BoardContainerProps = PropsWithChildren<{
    data: InitializeAction["payload"]
    onError: (e: unknown) => void
    onSubmit: (submission: Submission) => Promise<LossAction | WinAction>
}>
export const BoardContext = createContext<Readonly<[BoardState, React.Dispatch<Action>]> | undefined>(undefined)
const DEFAULT_STATE: BoardState = {
    answers: [],
    discrepancy: null,
    images: {},
    imageUUIDs: [],
    lastSubmission: [],
    mistakes: 0,
    totalAnswers: 0,
}
export const BoardContainer: React.FC<BoardContainerProps> = ({ children, data, onError, onSubmit }) => {
    const contextValue = useReducer(reducer, DEFAULT_STATE)
    const [state, dispatch] = contextValue
    useEffect(() => {
        dispatch({ type: "INITIALIZE", payload: { ...data, images: data.images.map(image => trimImage(image)) } })
    }, [data, dispatch])
    const submission = useMemo(
        () =>
            new Set(
                Object.values(state.images)
                    .filter(value => value.mode === "submitted")
                    .map(value => value.image.uuid),
            ),
        [state.images],
    )
    const imagesPerAnswer = select.imagesPerAnswer(state)
    useEffect(() => {
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
    return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>
}