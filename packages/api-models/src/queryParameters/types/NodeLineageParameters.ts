import { UUID } from "@phylopic/utils"
import { NodeEmbedded } from "../../types/NodeWithEmbedded"
import { ListParameters } from "./ListParameters"
export type NodeLineageParameters = ListParameters<NodeEmbedded> & {
    uuid: UUID
}
