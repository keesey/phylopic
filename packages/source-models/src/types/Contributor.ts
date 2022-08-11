import type { EmailAddress, ISOTimestamp } from "@phylopic/utils"
export type Contributor = Readonly<{
    created: ISOTimestamp
    emailAddress: EmailAddress | null
    modified: ISOTimestamp
    name: string
    showEmailAddress: boolean
}>
