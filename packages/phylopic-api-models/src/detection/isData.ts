import { isPositiveInteger } from "phylopic-utils/src/types"
import { Data } from "../types"
export const isData = (x: unknown): x is Data =>
    typeof x === "object" && x !== null && isPositiveInteger((x as Data).build)
export default isData
