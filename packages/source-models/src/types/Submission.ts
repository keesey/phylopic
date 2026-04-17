import type { Identifier, ISOTimestamp, UUID, ValidLicenseURL } from "@phylopic/utils"
export type Submission = Readonly<{
    attribution: string | null
    contributor: UUID
    created: ISOTimestamp
    // :TODO: Remove "?"
    existingUUID?: UUID | null
    newTaxonName: string | null
    sponsor: string | null
}> &
    (
        | Readonly<{
              identifier: Identifier | null
              license: ValidLicenseURL | null
              status: "incomplete"
          }>
        | Readonly<{
              identifier: Identifier
              license: ValidLicenseURL
              status: "submitted"
          }>
    )
