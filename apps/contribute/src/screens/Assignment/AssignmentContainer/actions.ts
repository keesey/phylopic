import { FSA, FSAWithPayload } from "flux-standard-action"
export type RequestChangeAction = FSA<"REQUEST_CHANGE">
export type RequestParentAction = FSA<"REQUEST_PARENT">
export type ResetAction = FSA<"RESET">
export type SetPendingAction = FSAWithPayload<"SET_PENDING", boolean>
export type SetTextAction = FSAWithPayload<"SET_TEXT", string>
export type Action = RequestChangeAction | RequestParentAction | ResetAction | SetPendingAction | SetTextAction
