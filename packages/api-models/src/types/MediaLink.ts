import { ImageMediaType } from "@phylopic/utils"
import { Link } from "./Link.js"
import { Sizes } from "./Sizes.js"
export interface MediaLink<THRef extends string = string, TType extends ImageMediaType = ImageMediaType>
    extends Link<THRef> {
    readonly sizes: Sizes
    readonly type: TType
}
