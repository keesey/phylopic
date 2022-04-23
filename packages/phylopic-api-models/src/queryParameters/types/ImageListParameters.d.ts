import { UUID } from "phylopic-utils/src"
import { ImageEmbedded } from "../../types"
import { ListParameters } from "./ListParameters"
export interface ImageListParameters extends ListParameters<ImageEmbedded> {
    filter_clade?: UUID
    filter_contributor?: UUID
    filter_license_by?: "true" | "false"
    filter_license_nc?: "true" | "false"
    filter_license_sa?: "true" | "false"
    filter_name?: string
    filter_node?: UUID
}
