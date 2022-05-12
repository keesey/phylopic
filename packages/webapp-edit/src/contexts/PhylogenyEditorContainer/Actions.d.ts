import { UUID } from "@phylopic/utils"
import { FSAWithPayload } from "flux-standard-action"
import { LoadAction } from "../LoadAction"
import { ResetAction } from "../ResetAction"
import { SaveAction } from "../SaveAction"
import { State } from "./State"

export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type DeleteNodeAction = FSAWithPayload<"DELETE_NODE", Readonly<{ uuid: UUID }>>
export type MergeNodesAction = FSAWithPayload<"MERGE_NODES", Readonly<{ destination: UUID; source: UUID }>>
export type SetNodeParentAction = FSAWithPayload<"SET_NODE_PARENT", Readonly<{ child: UUID; parent: UUID }>>
export type Action =
    | SaveAction
    | LoadAction
    | ResetAction
    | InitializeAction
    | DeleteNodeAction
    | MergeNodesAction
    | SetNodeParentAction
