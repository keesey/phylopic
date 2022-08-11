export type ReadField<T> = {
    readonly column: string
    readonly property: string & keyof T
}
