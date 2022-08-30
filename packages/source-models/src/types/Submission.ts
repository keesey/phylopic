import type { Hash, Identifier, ISOTimestamp, UUID, ValidLicenseURL } from "@phylopic/utils"
export type Submission = Readonly<{
    attribution: string | null
    contributor: UUID
    created: ISOTimestamp
    file: Hash
    newTaxonName: string | null
    sponsor: string | null
}> &
    (
        | Readonly<{
              identifier: Identifier | null
              license: ValidLicenseURL | null
              submitted: false
          }>
        | Readonly<{
              identifier: Identifier
              license: ValidLicenseURL
              submitted: true
          }>
    )
