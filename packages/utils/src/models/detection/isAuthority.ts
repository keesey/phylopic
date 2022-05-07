import { FaultDetector } from "../../detection/FaultDetector"
import isNormalizedText from "../../detection/isNormalizedText"
import { Authority } from "../types/Authority"
export const isAuthority: FaultDetector<Authority> = isNormalizedText
export default isAuthority
