import { Hash, Identifier } from "@phylopic/utils"
export type State = {
    changeRequested: boolean
    hash: Hash
    parentRequested: boolean
    pending: boolean
    text: string
}
