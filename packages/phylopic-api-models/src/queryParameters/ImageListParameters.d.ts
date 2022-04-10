import { ImageEmbedded } from "../models"
import { EmailAddress } from "../models/EmailAddress"
import { UUID } from "../models/UUID"
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
