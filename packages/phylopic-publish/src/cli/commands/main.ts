import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const main = (clientData: CLIData): CommandResult => {
    console.info(JSON.stringify(clientData.main, undefined, "\t"))
    return { clientData, sourceUpdates: [] }
}
export default main
