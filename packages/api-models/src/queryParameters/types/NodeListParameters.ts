import { NodeEmbedded } from "../../types/NodeWithEmbedded.js"
import { ListParameters } from "./ListParameters.js"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    filter_name?: string
}
