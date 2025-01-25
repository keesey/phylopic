import { ISOTimestamp, UUID } from "@phylopic/utils"
import { ImageEmbedded } from "../../types/ImageWithEmbedded"
import { ListParameters } from "./ListParameters"
export interface ImageListParameters extends ListParameters<ImageEmbedded> {
    filter_clade?: UUID
    filter_collection?: UUID
    filter_contributor?: UUID
    filter_created_after?: ISOTimestamp
    filter_created_before?: ISOTimestamp
    filter_license_by?: "true" | "false"
    filter_license_nc?: "true" | "false"
    filter_license_sa?: "true" | "false"
    filter_modified_after?: ISOTimestamp
    filter_modified_before?: ISOTimestamp
    filter_modifiedFile_after?: ISOTimestamp
    filter_modifiedFile_before?: ISOTimestamp
    filter_name?: string
    filter_node?: UUID
    filter_tags?: string;
}
