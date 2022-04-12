import { NodeEmbedded } from "phylopic-api-models/src/types/NodeWithEmbedded"
import { EntityType } from "../EntityType"
const node: EntityType<NodeEmbedded> = {
    embeds: ["childNodes", "parentNode", "primaryImage"],
    path: "nodes",
    tableName: "node",
    userLabel: "taxonomic group",
}
export default node
