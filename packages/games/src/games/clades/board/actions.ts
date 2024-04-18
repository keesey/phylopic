import type { UUID } from "@phylopic/utils"
import type { FSA, FSAWithPayload } from "flux-standard-action"
import { CladesBoardAnswer, CladesBoardImageState } from "./CladesBoardState"
export type CladesGameDeselectAction = FSAWithPayload<"DESELECT", UUID>
export type CladesGameDeselectAllAction = FSA<"DESELECT_ALL">
export type CladesGameInitializeAction = FSAWithPayload<
    "INITIALIZE",
    Readonly<{
        images: ReadonlyArray<CladesBoardImageState["image"]>
        numSets: number
    }>
>
export type CladesGameLossAction = FSAWithPayload<"LOSS", number>
export type CladesGameSelectAction = FSAWithPayload<"SELECT", UUID>
export type CladesGameShuffleAction = FSA<"SHUFFLE">
export type CladesGameSubmitAction = FSA<"SUBMIT">
export type CladesGameSubmitCancelAction = FSA<"SUBMIT_CANCEL">
export type CladesGameWinAction = FSAWithPayload<"WIN", CladesBoardAnswer["node"]>
export type CladesGameAction =
    | CladesGameDeselectAction
    | CladesGameDeselectAllAction
    | CladesGameInitializeAction
    | CladesGameLossAction
    | CladesGameSelectAction
    | CladesGameShuffleAction
    | CladesGameSubmitAction
    | CladesGameSubmitCancelAction
    | CladesGameWinAction
