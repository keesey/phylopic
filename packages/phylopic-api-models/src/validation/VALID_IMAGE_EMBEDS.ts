import { ImageEmbedded } from "../types"
const VALID_IMAGE_EMBEDS: ReadonlySet<keyof ImageEmbedded> = new Set(["generalNode", "nodes", "specificNode"])
export default VALID_IMAGE_EMBEDS
