import { UUID } from "@phylopic/utils"
import { CLIData } from "../../getCLIData.js"
const checkNewUUID = (cliData: Pick<CLIData, "images" | "nodes">, uuid: UUID) => {
    if (cliData.nodes.has(uuid)) {
        throw new Error("Not a new node UUID.")
    }
    if (cliData.images.has(uuid)) {
        throw new Error("UUID already used by an image.")
    }
}
export default checkNewUUID
