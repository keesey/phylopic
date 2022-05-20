import { ErrorFSAAuto, FSA } from "flux-standard-action"

export type StartSaveAction = FSA<"START_SAVE">
export type FailSaveAction = ErrorFSAAuto<"FAIL_SAVE">
export type CompleteSaveAction = FSA<"COMPLETE_SAVE">
export type SaveAction = StartSaveAction | FailSaveAction | CompleteSaveAction
