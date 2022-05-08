import { FaultDetector } from "../../detection/FaultDetector.js"
import isNormalizedText from "../../detection/isNormalizedText.js"
import { Authority } from "../types/Authority.js"
export const isAuthority: FaultDetector<Authority> = isNormalizedText
export default isAuthority
