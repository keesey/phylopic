import type { Tag } from "@phylopic/utils"
import { Data } from "./Data"
export interface Tags extends Data {
    readonly tags: readonly Tag[]
}
