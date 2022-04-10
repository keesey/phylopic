import { ClientData } from "../getClientData"
import { CommandResult } from "./CommandResult"
const main = (clientData: ClientData): CommandResult => {
    console.info(JSON.stringify(clientData.main, undefined, "\t"))
    return { clientData, sourceUpdates: [] }
}
export default main
