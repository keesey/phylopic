import { Editable } from "./Editable"
export interface Patchable<T> extends Editable<T> {
    patch(value: Partial<T>): Promise<void>
}
