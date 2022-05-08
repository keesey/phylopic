import { Contributor } from "./Contributor.js"
import { Image, ImageLinks } from "./Image.js"
import { Node } from "./Node.js"
import { WithEmbedded } from "./WithEmbedded.js"
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
