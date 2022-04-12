import { Command } from "@aws-sdk/types"
import { CLIData } from "../getCLIData"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SourceUpdate = Command<any, any, any, any, any>
export interface CommandResult {
    readonly clientData: CLIData
    readonly sourceUpdates: readonly SourceUpdate[]
}
