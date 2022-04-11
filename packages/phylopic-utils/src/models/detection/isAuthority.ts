import { Authority } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isAuthority: (x: unknown) => x is Authority = isNormalizedText
export default isAuthority
