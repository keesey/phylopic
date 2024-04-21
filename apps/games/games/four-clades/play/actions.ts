import type { UUID } from "@phylopic/utils"
import type { FSA, FSAWithPayload } from "flux-standard-action"
import { BoardAnswer, BoardImageState } from "./BoardState"
export type DeselectAction = FSAWithPayload<"DESELECT", UUID>
export type DeselectAllAction = FSA<"DESELECT_ALL">
export type InitializeAction = FSAWithPayload<
    "INITIALIZE",
    Readonly<{
        images: ReadonlyArray<BoardImageState["image"]>
        numAnswers: number
    }>
>
export type LossAction = FSAWithPayload<"LOSS", number>
export type SelectAction = FSAWithPayload<"SELECT", UUID>
export type ShuffleAction = FSA<"SHUFFLE">
export type SubmitAction = FSA<"SUBMIT">
export type SubmitCancelAction = FSA<"SUBMIT_CANCEL">
export type WinAction = FSAWithPayload<"WIN", BoardAnswer["node"]>
export type Action =
    | DeselectAction
    | DeselectAllAction
    | InitializeAction
    | LossAction
    | SelectAction
    | ShuffleAction
    | SubmitAction
    | SubmitCancelAction
    | WinAction
