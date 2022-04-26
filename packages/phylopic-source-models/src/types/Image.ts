import { EmailAddress, ISOTimestamp, LicenseURL, UUID } from "phylopic-utils"
export type Image = Readonly<{
    attribution: string | null
    created: ISOTimestamp
    contributor: EmailAddress
    license: LicenseURL
    general: UUID | null
    specific: UUID
    sponsor: string | null
}>
