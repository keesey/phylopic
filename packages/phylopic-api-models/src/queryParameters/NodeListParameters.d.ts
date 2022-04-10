import { NodeEmbedded } from "../models"
import { ListParameters } from "./ListParameters"
export interface NodeListParameters extends ListParameters<NodeEmbedded> {
    name?: string
}
