import type { UUID } from "@phylopic/utils"
import type { ListParameters } from "./ListParameters"
export interface ContributorListParameters extends ListParameters<{}> {
    filter_collection?: UUID
}
