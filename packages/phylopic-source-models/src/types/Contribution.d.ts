import { UUID } from "phylopic-utils/src"
import { Image } from "./Image"
import { NodeIdentifier } from "./NodeIdentifier"
export type Contribution = Pick<Image, "attribution" | "created" | "contributor" | "license" | "sponsor"> &
    Readonly<{
        general?: NodeIdentifier
        specific: NodeIdentifier
        uuid: UUID
    }>
