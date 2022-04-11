import { Image } from "./Image"
import { Node } from "./Node"
export interface NodeEmbedded {
    readonly childNodes: readonly Node[]
    readonly parentNode: Node | null
    readonly primaryImage: Image | null
}
export interface NodeWithEmbedded extends Node {
    readonly _embedded: Partial<NodeEmbedded>
}
