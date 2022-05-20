import { Nomen } from "@phylopic/utils"
import { FSAWithPayload, FSAWithPayloadAndMeta } from "flux-standard-action"
import { SaveAction } from "../SaveAction"
import { State } from "./State"

export type NodeDestination = "created" | "original"
export type MoveMeta = Readonly<{
    destination: NodeDestination
}>
export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type MoveNameAction = FSAWithPayloadAndMeta<"MOVE_NAME", Nomen, MoveMeta>
export type Action = SaveAction | InitializeAction | MoveNameAction
