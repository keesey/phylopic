import { Command } from "@aws-sdk/types"
import { CLIData } from "../getCLIData.js"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SourceUpdate = Command<any, any, any, any, any>
export interface CommandResult {
    readonly cliData: CLIData
    readonly sourceUpdates: readonly SourceUpdate[]
}
