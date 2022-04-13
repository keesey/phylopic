import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const source = (clientData: CLIData): CommandResult => {
    console.info(JSON.stringify(clientData.source, undefined, "\t"))
    return { clientData, sourceUpdates: [] }
}
export default source
