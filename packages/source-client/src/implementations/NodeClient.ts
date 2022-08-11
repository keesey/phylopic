import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { SourceClient } from "../interfaces/SourceClient"
import ClientProvider from "./ClientProvider"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGPatcher from "./pg/PGPatcher"
export default class NodeClient extends PGPatcher<Node> implements ReturnType<SourceClient["node"]> {
    constructor(protected provider: ClientProvider, protected uuid: UUID) {
        super(provider.getPG, NODE_TABLE, [{ column: "uuid", type: "uuid", value: uuid }], NODE_FIELDS, normalizeNode)
    }
}
