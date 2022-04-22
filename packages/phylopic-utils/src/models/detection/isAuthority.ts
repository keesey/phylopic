import { FaultDetector, isNormalizedText } from "../../detection"
import { Authority } from "../types"
export const isAuthority: FaultDetector<Authority> = isNormalizedText
export default isAuthority
