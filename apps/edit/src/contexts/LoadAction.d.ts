import { ErrorFSAAuto, FSA } from "flux-standard-action"

export type StartLoadAction = FSA<"START_LOAD">
export type FailLoadAction = ErrorFSAAuto<"FAIL_LOAD">
export type CompleteLoadAction = FSA<"COMPLETE_LOAD">
export type LoadAction = StartLoadAction | FailLoadAction | CompleteLoadAction
