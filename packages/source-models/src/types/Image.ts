import type { ISOTimestamp, LicenseURL, UUID } from "@phylopic/utils"
export type Image = Readonly<{
    accepted: boolean
    attribution: string | null
    created: ISOTimestamp
    contributor: UUID
    license: LicenseURL | null
    modified: ISOTimestamp
    general: UUID | null
    specific: UUID | null
    sponsor: string | null
    submitted: boolean
}>
