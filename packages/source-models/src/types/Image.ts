import type { ISOTimestamp, LicenseURL, UUID } from "@phylopic/utils"
export type Image = Readonly<{
    attribution: string | null
    created: ISOTimestamp
    contributor: UUID
    license: LicenseURL
    modified: ISOTimestamp
    general: UUID | null
    specific: UUID
    sponsor: string | null
}>
