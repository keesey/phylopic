export type Page<TValue, TPageSpecifier> = {
    readonly items: readonly TValue[]
    readonly next?: TPageSpecifier
}
