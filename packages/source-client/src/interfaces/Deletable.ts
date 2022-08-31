import { Readable } from "./Readable"
export interface Deletable<T> extends Readable<T> {
    delete(): Promise<void>
}
