import { Image } from "./Image"
import { NodeIdentifier } from "./NodeIdentifier"
export type Submission = Partial<
    Pick<Image, "attribution" | "created" | "license" | "sponsor"> &
        Readonly<{
            general: NodeIdentifier | null
            specific: NodeIdentifier
        }>
>
