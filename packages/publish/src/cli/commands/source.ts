import { CLIData } from "../getCLIData.js"
import { CommandResult } from "./CommandResult.js"
const source = (cliData: CLIData): CommandResult => {
    console.info(JSON.stringify(cliData.source, undefined, "\t"))
    return { cliData, sourceUpdates: [] }
}
export default source
