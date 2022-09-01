import type { Identifier, ISOTimestamp, UUID, ValidLicenseURL } from "@phylopic/utils"
export type Submission = Readonly<{
    attribution?: string
    contributor: UUID
    created: ISOTimestamp
    newTaxonName?: string
    sponsor?: string
}> &
    (
        | Readonly<{
              identifier?: Identifier
              license?: ValidLicenseURL
              status: "incomplete"
          }>
        | Readonly<{
              identifier: Identifier
              license: ValidLicenseURL
              status: "submitted"
          }>
    )
