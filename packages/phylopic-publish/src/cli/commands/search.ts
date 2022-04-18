import { Nomen } from "phylopic-utils/src/models"
import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
import nameMatches from "./utils/nameMatches"
const search = (cliData: CLIData, name: Nomen): CommandResult => {
    const nameText = name.map(({ text }) => text).join(" ")
    const entries = [...cliData.nodes.entries()].filter(([, { names }]) =>
        names.some(nodeName => nameMatches(nameText, nodeName)),
    )
    console.info(`Found ${entries.length} node${entries.length === 1 ? "" : "s"}:`)
    entries.forEach(([uuid]) => console.info(`\t- ${JSON.stringify(uuid)}`))
    return { cliData, sourceUpdates: [] }
}
export default search
