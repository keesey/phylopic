import { FSAWithPayload } from "flux-standard-action"
import { Nomen } from "@phylopic/utils"
import { ResetAction } from "../ResetAction"
import { SaveAction } from "../SaveAction"
import { State } from "./State"

export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type AddNameAction = FSAWithPayload<"ADD_NAME", Nomen>
export type RemoveNameAction = FSAWithPayload<"REMOVE_NAME", Nomen>
export type SetCanonicalNameAction = FSAWithPayload<"SET_CANONICAL_NAME", Nomen>
export type Action =
    | InitializeAction
    | ResetAction
    | SaveAction
    | AddNameAction
    | RemoveNameAction
    | SetCanonicalNameAction
