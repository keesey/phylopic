import type { Contributor } from "./Contributor"
import type { Image, ImageLinks } from "./Image"
import type { Node } from "./Node"
import type { WithEmbedded } from "./WithEmbedded"

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
