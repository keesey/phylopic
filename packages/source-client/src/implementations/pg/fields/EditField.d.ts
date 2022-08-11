import { ReadField } from "./ReadField"
export type EditField<T> = ReadField<T> & {
    readonly insertable: boolean
    readonly type: string
    readonly updateable: boolean
}
