export type EmbeddableParameters<TEmbedded> = {
    [Property in keyof TEmbedded as `embed_${string & Property}`]?: "true"
}
