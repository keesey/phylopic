import type { UUID } from "@phylopic/utils"
import type { FSA, FSAWithPayload } from "flux-standard-action"
import { BoardState, GameImage, GameNode } from "./BoardState"
export type AutoWinAction = FSAWithPayload<"AUTO_WIN", readonly GameNode[]>
export type DeselectAction = FSAWithPayload<"DESELECT", UUID>
export type DeselectAllAction = FSA<"DESELECT_ALL">
export type InitializeAction = FSAWithPayload<
    "INITIALIZE",
    Readonly<{
        images: ReadonlyArray<GameImage>
        numAnswers: number
    }>
>
export type LossAction = FSAWithPayload<"LOSS", number>
export type RestoreAction = FSAWithPayload<"RESTORE", BoardState>
export type SelectAction = FSAWithPayload<"SELECT", UUID>
export type ShuffleAction = FSA<"SHUFFLE">
export type SubmitAction = FSA<"SUBMIT">
export type SubmitCancelAction = FSA<"SUBMIT_CANCEL">
export type WinAction = FSAWithPayload<"WIN", GameNode>
export type Action =
    | AutoWinAction
    | DeselectAction
    | DeselectAllAction
    | InitializeAction
    | LossAction
    | RestoreAction
    | SelectAction
    | ShuffleAction
    | SubmitAction
    | SubmitCancelAction
    | WinAction
