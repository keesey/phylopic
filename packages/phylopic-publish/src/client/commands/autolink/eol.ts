import type { Entity, Node } from "phylopic-source-models/src"
import type { ClientData } from "../../getClientData"
import { CommandResult, SourceUpdate } from "../CommandResult"
const autolinkEOL = async (clientData: ClientData, _root: Entity<Node>): Promise<CommandResult> => {
    const sourceUpdates: SourceUpdate[] = []
    return {
        clientData,
        sourceUpdates,
    }
}
export default autolinkEOL
