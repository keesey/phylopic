import { Entity, Node } from "phylopic-source-models/src"
import { CLIData } from "../getCLIData"
import autolinkEOL from "./autolink/eol"
import autolinkOTOL from "./autolink/otol"
import { CommandResult } from "./CommandResult"
const autolink = (cliData: CLIData, source: "eol" | "otol", root: Entity<Node>): Promise<CommandResult> => {
    switch (source) {
        case "eol":
            return autolinkEOL(cliData, root)
        case "otol":
            return autolinkOTOL(cliData, root)
        default:
            throw new Error(`Unrecognized autolink source: ${JSON.stringify(source)}.`)
    }
}
export default autolink
