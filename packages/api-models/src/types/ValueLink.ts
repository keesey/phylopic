import { Link } from "./Link"
export interface ValueLink<THRef extends string = string, TValue = number | boolean | string | null>
    extends Link<THRef> {
    readonly value: TValue
}
