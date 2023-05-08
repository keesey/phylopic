export type CSV<TColumnName extends string = string> = Readonly<{
    columns: readonly TColumnName[]
    items: readonly Readonly<Record<TColumnName, string>>[]
}>
