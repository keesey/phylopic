import { Readable } from "./Readable"
export interface Editable<T> extends Readable<T> {
    delete(): Promise<void>
    put(value: T): Promise<void>
}
