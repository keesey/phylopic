"use client"
import type { UUID } from "@phylopic/utils"
import { usePathname } from "next/navigation"
import { PropsWithChildren, createContext, useEffect, useMemo, useReducer } from "react"
import { CalendarDate, toPath } from "~/lib/datetime"
import { BoardState } from "./BoardState"
import { Action, InitializeAction } from "./actions"
import reducer from "./reducer"
import { select } from "./select"
import { trimImage } from "./trimImage"
export type Submission = {
    uuids: ReadonlySet<UUID>
    mistakes: number
}
export type BoardContainerProps = PropsWithChildren<{
    data: InitializeAction["payload"] | null
    gameDate?: CalendarDate
    onNewGame?: () => void
    onSubmit: (submission: Submission) => Promise<Action>
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
export const BoardContainer: React.FC<BoardContainerProps> = ({ children, data, gameDate, onNewGame, onSubmit }) => {
    const contextValue = useReducer(reducer, DEFAULT_STATE)
    const pathname = usePathname()
    const [state, dispatch] = contextValue
    const isPractice = pathname.endsWith("/practice")
    const localStorageKey =
        gameDate || isPractice ? `@phylopic/games/four-clades${gameDate ? toPath(gameDate) : "/practice/state"}` : null
    useEffect(() => {
        if (localStorageKey) {
            const saved = localStorage.getItem(localStorageKey)
            if (saved) {
                try {
                    const payload = JSON.parse(saved)
                    dispatch({ type: "RESTORE", payload })
                    return
                } catch {
                    // Must be corrupt.
                    localStorage.removeItem(localStorageKey)
                }
            }
        }
        if (data) {
            dispatch({ type: "INITIALIZE", payload: { ...data, images: data.images.map(image => trimImage(image)) } })
        } else {
            onNewGame?.()
        }
    }, [data, dispatch, isPractice, localStorageKey])
    useEffect(() => {
        if (localStorageKey && state.totalAnswers > 0) {
            localStorage.setItem(localStorageKey, JSON.stringify(state))
        }
    }, [localStorageKey, state])
    const submissionJSON = useMemo(
        () => JSON.stringify({
            mistakes: state.mistakes,
            uuids: Object.values(state.images)
                    .filter(value => value.mode === "submitted")
                    .map(value => value.image.uuid)
                    .sort()
        }),
        [state.images, state.mistakes],
    )
    const imagesPerAnswer = select.imagesPerAnswer(state)
    useEffect(() => {
        const submissionRaw = JSON.parse(submissionJSON) as Readonly<{ mistakes: number; uuids: readonly UUID[] }>
        const submission: Submission = {
            ...submissionRaw,
            uuids: new Set(submissionRaw.uuids)
        }
        if (submission.uuids.size === imagesPerAnswer) {
            ;(async () => {
                try {
                    dispatch(await onSubmit(submission))
                } catch (e) {
                    dispatch({ type: "SUBMIT_CANCEL" })
                    alert(String(e))
                }
            })()
        }
    }, [dispatch, imagesPerAnswer, submissionJSON])
    return <BoardContext.Provider value={contextValue}>{children}</BoardContext.Provider>
}
