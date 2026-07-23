import { Readable } from "./Readable"
export interface Deletable<T> extends Readable<T> {
    delete(): Promise<void>
    isRestorable(): Promise<boolean>
    restore(): Promise<T>
}
