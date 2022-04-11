import { NodeEmbedded } from "../types"
import { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    name?: string
}
