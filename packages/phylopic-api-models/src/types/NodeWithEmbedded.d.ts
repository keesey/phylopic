import { Image } from "./Image"
import { Node, NodeLinks } from "./Node"
import { WithEmbedded } from "./WithEmbedded"
export interface NodeEmbedded {
    readonly childNodes: readonly Node[]
    readonly parentNode: Node | null
    readonly primaryImage: Image | null
}
export type NodeWithEmbedded = WithEmbedded<Node, NodeLinks, "childNodes" | "parentNode" | "primaryImage", NodeEmbedded>
