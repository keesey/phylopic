import { Name } from "phylopic-source-models/src"
import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
import nameMatches from "./utils/nameMatches"
const search = (clientData: ClientData, name: Name): CommandResult => {
    const nameText = name.map(({ text }) => text).join(" ")
    const entries = [...clientData.nodes.entries()].filter(([, node]) =>
        node.names.some(nodeName => nameMatches(nameText, nodeName)),
    )
    console.info(`Found ${entries.length} node${entries.length === 1 ? "" : "s"}:`)
    entries.forEach(([uuid]) => console.info(`\t- ${JSON.stringify(uuid)}`))
    return { clientData, sourceUpdates: [] }
}
export default search
