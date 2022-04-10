import { Image } from "./Image"
import { NodeIdentifier } from "./NodeIdentifier"
import { UUID } from "./UUID"

export type Submission = Pick<Image, "attribution" | "created" | "contributor" | "license" | "sponsor"> &
    Readonly<{
        general?: NodeIdentifier
        specific: NodeIdentifier
        uuid: UUID
    }>
