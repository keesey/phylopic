import { Contributor } from "./Contributor"
import { Image, ImageLinks } from "./Image"
import { Node } from "./Node"
import { WithEmbedded } from "./WithEmbedded"
export interface ImageEmbedded {
    readonly contributor: Contributor
    readonly generalNode: Node | null
    readonly nodes: readonly Node[]
    readonly specificNode: Node
}
export type ImageWithEmbedded = WithEmbedded<
    Image,
    ImageLinks,
    "contributor" | "generalNode" | "nodes" | "specificNode",
    ImageEmbedded
>
