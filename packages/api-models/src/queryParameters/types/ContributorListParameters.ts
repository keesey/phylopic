import { UUID } from "@phylopic/utils"
import { ListParameters } from "./ListParameters"
export interface ContributorListParameters extends ListParameters<{}> {
    filter_collection?: UUID
}
