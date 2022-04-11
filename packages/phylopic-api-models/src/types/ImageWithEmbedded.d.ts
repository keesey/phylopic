import { Image } from "./Image"
import { Node } from "./Node"
export interface ImageEmbedded {
    readonly generalNode: Node | null
    readonly nodes: readonly Node[]
    readonly specificNode: Node
}
export interface ImageWithEmbedded extends Image {
    readonly _embedded: Partial<ImageEmbedded>
}
