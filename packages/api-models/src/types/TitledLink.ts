import { Link } from "./Link.js"
export interface TitledLink<THRef extends string = string> extends Link<THRef> {
    readonly title: string
}
