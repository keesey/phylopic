import { Deletable } from "./Deletable"
export interface Editable<T> extends Deletable<T> {
    put(value: T): Promise<void>
}
