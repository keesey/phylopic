export type EmbeddableParameters<TEmbedded> = {
    [Property in string & keyof TEmbedded as `embed_${Property}`]?: "true"
}
