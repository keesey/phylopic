export interface Readable<T> {
    get(): Promise<T>
    exists(): Promise<boolean>
}
