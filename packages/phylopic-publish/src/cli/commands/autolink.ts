import { Entity, Node } from "phylopic-source-models"
import { CLIData } from "../getCLIData"
import autolinkEOL from "./autolink/eol"
import autolinkOTOL from "./autolink/otol"
import { CommandResult } from "./CommandResult"
const autolink = (clientData: CLIData, source: "eol" | "otol", root: Entity<Node>): Promise<CommandResult> => {
    switch (source) {
        case "eol":
            return autolinkEOL(clientData, root)
        case "otol":
            return autolinkOTOL(clientData, root)
        default:
            throw new Error(`Unrecognized autolink source: ${JSON.stringify(source)}.`)
    }
}
export default autolink
