import { UUID } from "phylopic-utils/src/models/types"
import { ImageWithEmbedded } from "~/types"
import { ListParameters } from "./ListParameters"
export interface ImageListParameters extends ListParameters<ImageWithEmbedded> {
    clade?: UUID
    contributor?: UUID
    license_by?: "true" | "false"
    license_nc?: "true" | "false"
    license_sa?: "true" | "false"
    name?: string
    node?: UUID
}
