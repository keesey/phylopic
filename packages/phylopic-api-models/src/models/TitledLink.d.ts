import { Link } from "./Link"
export interface TitledLink<THRef extends string = string> extends Link<THRef> {
    readonly title: string
}
