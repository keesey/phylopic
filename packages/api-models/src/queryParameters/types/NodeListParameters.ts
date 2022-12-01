import { UUID } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    filter_collection?: UUID
    filter_name?: string
}
