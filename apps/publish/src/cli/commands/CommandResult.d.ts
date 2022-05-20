import { Command } from "@aws-sdk/types"
import { CLIData } from "../getCLIData"
export type SourceUpdate = Command<any, any, any, any, any>
export interface CommandResult {
    readonly cliData: CLIData
    readonly sourceUpdates: readonly SourceUpdate[]
}
