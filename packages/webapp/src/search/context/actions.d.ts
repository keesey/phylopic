import { FSA, FSAWithPayload, FSAWithPayloadAndMeta } from "flux-standard-action"
import { Authority, ImageWithEmbedded, Namespace, NodeWithEmbedded, ObjectID } from "@phylopic/api-models"
export type TextBasedMeta = Readonly<{ basis: string }>
export type NamespaceMeta = Readonly<{ authority: Authority; namespace: Namespace }>
export type ObjectMeta = NamespaceMeta & Readonly<{ objectID: ObjectID }>
export type AddExternalMatchesAction = FSAWithPayloadAndMeta<"ADD_EXTERNAL_MATCHES", readonly string[], TextBasedMeta>
export type AddExternalResultsAction = FSAWithPayloadAndMeta<
    "ADD_EXTERNAL_RESULTS",
    Readonly<Record<ObjectID, string>>,
    NamespaceMeta & TextBasedMeta
>
export type ResetAction = FSA<"RESET">
export type ResetInternalAction = FSA<"RESET_INTERNAL">
export type ResolveExternalAction = FSAWithPayloadAndMeta<"RESOLVE_EXTERNAL", NodeWithEmbedded, ObjectMeta>
export type SetActiveAction = FSAWithPayload<"SET_ACTIVE", boolean>
export type SetImageResultsAction = FSAWithPayloadAndMeta<
    "SET_IMAGE_RESULTS",
    readonly ImageWithEmbedded[],
    TextBasedMeta
>
export type SetInternalMatchesAction = FSAWithPayloadAndMeta<"SET_INTERNAL_MATCHES", readonly string[], TextBasedMeta>
export type SetNodeResultsAction = FSAWithPayloadAndMeta<"SET_NODE_RESULTS", readonly NodeWithEmbedded[], TextBasedMeta>
export type SetTextAction = FSAWithPayload<"SET_TEXT", string>
export type Action =
    | AddExternalMatchesAction
    | AddExternalResultsAction
    | ResetAction
    | ResetInternalAction
    | ResolveExternalAction
    | SetActiveAction
    | SetImageResultsAction
    | SetInternalMatchesAction
    | SetNodeResultsAction
    | SetTextAction
