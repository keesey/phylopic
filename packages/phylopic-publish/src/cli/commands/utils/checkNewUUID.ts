import { UUID } from "phylopic-utils/src/models"
import { CLIData } from "../../getCLIData"
const checkNewUUID = (clientData: Pick<CLIData, "images" | "nodes">, uuid: UUID) => {
    if (clientData.nodes.has(uuid)) {
        throw new Error("Not a new node UUID.")
    }
    if (clientData.images.has(uuid)) {
        throw new Error("UUID already used by an image.")
    }
}
export default checkNewUUID
