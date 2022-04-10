import { UUID } from "phylopic-source-models/src"
import { ClientData } from "../../getClientData"
const checkNewUUID = (clientData: Pick<ClientData, "images" | "nodes">, uuid: UUID) => {
    if (clientData.nodes.has(uuid)) {
        throw new Error("Not a new node UUID.")
    }
    if (clientData.images.has(uuid)) {
        throw new Error("UUID already used by an image.")
    }
}
export default checkNewUUID
