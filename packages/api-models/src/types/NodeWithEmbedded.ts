import { Image } from "./Image.js"
import { Node, NodeLinks } from "./Node.js"
import { WithEmbedded } from "./WithEmbedded.js"
export interface NodeEmbedded {
    readonly childNodes: readonly Node[]
    readonly parentNode: Node | null
    readonly primaryImage: Image | null
}
export type NodeWithEmbedded = WithEmbedded<Node, NodeLinks, "childNodes" | "parentNode" | "primaryImage", NodeEmbedded>
