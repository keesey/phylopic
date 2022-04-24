import { EmailAddress, ISOTimestamp, LicenseURL, UUID } from "phylopic-utils/src"
export type Image = Readonly<{
    attribution: string | null
    created: ISOTimestamp
    contributor: EmailAddress
    license: LicenseURL
    general: UUID | null
    specific: UUID
    sponsor: string | null
}>
