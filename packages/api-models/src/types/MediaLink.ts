import type { ImageMediaType } from "@phylopic/utils"
import type { Link } from "./Link"
import type { Sizes } from "./Sizes"
export interface MediaLink<
    THRef extends string = string,
    TType extends ImageMediaType = ImageMediaType,
> extends Link<THRef> {
    readonly sizes: Sizes
    readonly type: TType
}
