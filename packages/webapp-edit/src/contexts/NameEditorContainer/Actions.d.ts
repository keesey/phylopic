import { Nomen } from "@phylopic/utils"
import { FSAWithMeta, FSAWithPayload, FSAWithPayloadAndMeta } from "flux-standard-action"
import { NomenPart, NomenPartClass } from "parse-nomen"
import { State } from "./State"

export type NomenPartMeta = Readonly<{
    index: number
}>
export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type SetClassAction = FSAWithPayloadAndMeta<"SET_CLASS", NomenPartClass, NomenPartMeta>
export type SetTextAction = FSAWithPayloadAndMeta<"SET_TEXT", string, NomenPartMeta>
export type AppendPartAction = FSAWithPayload<"APPEND_PART", NomenPart>
export type RemovePartAction = FSAWithMeta<"REMOVE_PART", undefined, NomenPartMeta>
export type UpdatePartAction = FSAWithPayloadAndMeta<"UPDATE_PART", NomenPart, NomenPartMeta>
export type UpdateNameAction = FSAWithPayload<"UPDATE_NAME", Nomen>
export type Action =
    | InitializeAction
    | SetClassAction
    | SetTextAction
    | AppendPartAction
    | RemovePartAction
    | UpdatePartAction
    | UpdateNameAction
