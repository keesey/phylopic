import { EmailAddress, ISOTimestamp, LicenseURL, UUID } from "phylopic-utils/src/models"
export type Image = Readonly<{
    attribution?: string
    created: ISOTimestamp
    contributor: EmailAddress
    license: LicenseURL
    general?: UUID
    specific: UUID
    sponsor?: string
}>
