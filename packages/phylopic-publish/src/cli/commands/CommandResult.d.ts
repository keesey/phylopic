import { Command } from "@aws-sdk/types"
import { ClientData } from "../getClientData"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SourceUpdate = Command<any, any, any, any, any>
export interface CommandResult {
    readonly clientData: ClientData
    readonly sourceUpdates: readonly SourceUpdate[]
}
