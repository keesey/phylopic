import { EmailAddress, ISOTimestamp } from "phylopic-utils/src/models/types"
export type Contributor = Readonly<{
    emailAddress: EmailAddress | null
    created: ISOTimestamp
    name: string
    showEmailAddress: boolean
}>
