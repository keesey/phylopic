import { Link } from "./Link"
export interface Links<TSelfLink extends Link = Link> {
    readonly self: TSelfLink
}
