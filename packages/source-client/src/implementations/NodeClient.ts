import { Node } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { Listable } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import NodeLineageClient from "./NodeLineageClient"
import NODE_FIELDS from "./pg/constants/NODE_FIELDS"
import NODE_TABLE from "./pg/constants/NODE_TABLE"
import normalizeNode from "./pg/normalization/normalizeNode"
import PGPatcher from "./pg/PGPatcher"
export default class NodeClient extends PGPatcher<Node & { uuid: UUID }> implements ReturnType<SourceClient["node"]> {
    constructor(protected provider: PGClientProvider, protected uuid: UUID) {
        super(provider, NODE_TABLE, [{ column: "uuid", type: "uuid", value: uuid }], NODE_FIELDS, normalizeNode)
        this.lineage = new NodeLineageClient(provider, uuid)
    }
    readonly lineage: Listable<Node & { uuid: UUID }, number>
}
