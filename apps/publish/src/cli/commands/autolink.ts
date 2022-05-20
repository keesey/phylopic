import { Entity, Node } from "@phylopic/source-models"
import { CLIData } from "../getCLIData.js"
import autolinkEOL from "./autolink/eol.js"
import autolinkOTOL from "./autolink/otol.js"
import { CommandResult } from "./CommandResult.js"
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
