import type { UUID } from "@phylopic/utils"
import { Image } from "./Image"
import { NodeIdentifier } from "./NodeIdentifier"
export type Contribution = Pick<Image, "attribution" | "created" | "contributor" | "license" | "sponsor"> &
    Readonly<{
        general: NodeIdentifier | null
        specific: NodeIdentifier
        uuid: UUID
    }>
