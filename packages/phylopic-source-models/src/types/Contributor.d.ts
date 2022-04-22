import { EmailAddress, ISOTimestamp } from "phylopic-utils/src"
export type Contributor = Readonly<{
    emailAddress: EmailAddress | null
    created: ISOTimestamp
    name: string
    showEmailAddress: boolean
}>
