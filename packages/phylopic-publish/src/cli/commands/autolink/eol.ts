import type { Entity, Node } from "phylopic-source-models"
import type { CLIData } from "../../getCLIData"
import { CommandResult, SourceUpdate } from "../CommandResult"
const autolinkEOL = async (clientData: CLIData, _root: Entity<Node>): Promise<CommandResult> => {
    const sourceUpdates: SourceUpdate[] = []
    return {
        clientData,
        sourceUpdates,
    }
}
export default autolinkEOL
