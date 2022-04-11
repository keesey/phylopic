import { EmailAddress, UUID } from "phylopic-utils/src/models/types"
import { ImageEmbedded } from "../types"
import { ListParameters } from "./ListParameters"
export interface ImageListParameters extends ListParameters<ImageEmbedded> {
    clade?: UUID
    contributor?: EmailAddress
    license_by?: "true" | "false"
    license_nc?: "true" | "false"
    license_sa?: "true" | "false"
    name?: string
    node?: UUID
}
