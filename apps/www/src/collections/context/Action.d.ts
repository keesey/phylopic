import { UUID } from "@phylopic/utils"
import { FSAWithMeta, FSAWithPayload, FSAWithPayloadAndMeta } from "flux-standard-action"
import { EntityRecord, State } from "./State"
export type AddCollectionAction = FSAWithPayload<"ADD_COLLECTION", string>
export type AddToCurrentCollectionAction = FSAWithPayload<"ADD_TO_CURRENT_COLLECTION", EntityRecord>
export type InitializeAction = FSAWithPayload<"INITIALIZE", State>
export type RemoveCollectionAction = FSAWithPayload<"REMOVE_COLLECTION", string>
export type RemoveFromCurrentCollectionAction = FSAWithPayload<"REMOVE_FROM_CURRENT_COLLECTION", UUID>
export type RenameCollectionAction = FSAWithPayload<"RENAME_COLLECTION", Readonly<[string, string]>>
export type SetCurrentCollectionAction = FSAWithPayload<"SET_CURRENT_COLLECTION", string | null>
export type Action =
    | AddCollectionAction
    | AddToCurrentCollectionAction
    | InitializeAction
    | RemoveCollectionAction
    | RemoveFromCurrentCollectionAction
    | RenameCollectionAction
    | SetCurrentCollectionAction
