import { ImageMediaType } from "@phylopic/utils/dist/models/types"
import { Link } from "./Link"
import { Sizes } from "./Sizes"
export interface MediaLink<THRef extends string = string, TType extends ImageMediaType = ImageMediaType>
    extends Link<THRef> {
    readonly sizes: Sizes
    readonly type: TType
}
