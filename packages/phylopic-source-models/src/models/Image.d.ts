import { EmailAddress } from "./EmailAddress"
import { ISODateTime } from "./ISODateTime"
import { LicenseURL } from "./LicenseURL"
import { UUID } from "./UUID"

export type Image = Readonly<{
    attribution?: string
    created: ISODateTime
    contributor: EmailAddress
    license: LicenseURL
    general?: UUID
    specific: UUID
    sponsor?: string
}>
