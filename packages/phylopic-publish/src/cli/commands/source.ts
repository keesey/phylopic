import { CLIData } from "../getCLIData"
import { CommandResult } from "./CommandResult"
const source = (cliData: CLIData): CommandResult => {
    console.info(JSON.stringify(cliData.source, undefined, "\t"))
    return { cliData, sourceUpdates: [] }
}
export default source
