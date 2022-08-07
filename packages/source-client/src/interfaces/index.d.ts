export interface Readable<T> {
    get(): Promise<T>
    exists(): Promise<boolean>
}
export interface Editable<T> extends Readable<T> {
    delete(): Promise<void>
    put(value: T): Promise<void>
}
export interface Patchable<T> extends Editable<T> {
    patch(value: Partial<T>): Promise<void>
}
export interface List<T extends string = string> {
    readonly items: readonly T[]
    nextToken?: string
}
export interface ImageFile {
    data: Buffer
    type: ImageMediaType
}
