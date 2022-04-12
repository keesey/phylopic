export interface EntityType<TEmbedded> {
    readonly embeds: ReadonlyArray<keyof TEmbedded>
    readonly path: string
    readonly tableName: string
    readonly userLabel: string
}
