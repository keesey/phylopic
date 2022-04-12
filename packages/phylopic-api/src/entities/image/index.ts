import { ImageEmbedded } from "phylopic-api-models"
import { EntityType } from "../EntityType"
const image: EntityType<ImageEmbedded> = {
    embeds: ["generalNode", "nodes", "specificNode"],
    path: "images",
    tableName: "image",
    userLabel: "silhouette image",
}
export default image
