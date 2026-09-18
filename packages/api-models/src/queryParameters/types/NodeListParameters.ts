import type { UUID } from "@phylopic/utils"
import type { NodeEmbedded } from "../../types/NodeWithEmbedded"
import type { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    filter_collection?: UUID
    filter_name?: string
}
