import type { ISOTimestamp, LicenseURL, Tag, UUID } from "@phylopic/utils"
export type Image = Readonly<{
    attribution: string | null
    created: ISOTimestamp
    contributor: UUID
    license: LicenseURL
    modified: ISOTimestamp
    general: UUID | null
    specific: UUID
    sponsor: string | null
    tags: readonly Tag[]
    unlisted: boolean
}>
