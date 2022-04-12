import { NodeEmbedded } from "../types/NodeWithEmbedded"
import { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    name?: string
}
