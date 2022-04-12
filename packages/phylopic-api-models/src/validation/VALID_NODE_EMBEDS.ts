import { NodeEmbedded } from "../types"
const VALID_NODE_EMBEDS: ReadonlySet<keyof NodeEmbedded> = new Set(["childNodes", "parentNode", "primaryImage"])
export default VALID_NODE_EMBEDS