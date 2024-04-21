import type { FSA, FSAWithPayload } from "flux-standard-action"
export type InitializeAction<TModel> = FSAWithPayload<"INITIALIZE", TModel>
export type PushAction<TModel> = FSAWithPayload<"PUSH", TModel>
export type RedoAction = FSA<"REDO">
export type UndoAction = FSA<"UNDO">
export type Action<TModel> = InitializeAction<TModel> | PushAction<TModel> | RedoAction | UndoAction
