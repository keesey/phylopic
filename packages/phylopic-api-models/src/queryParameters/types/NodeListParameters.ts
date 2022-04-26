import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    filter_name?: string
}
