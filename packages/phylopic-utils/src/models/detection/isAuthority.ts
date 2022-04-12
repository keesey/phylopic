import { FaultDetector, isNormalizedText } from "../../detection"
import { Authority } from "../types"
const isAuthority: FaultDetector<Authority> = isNormalizedText
export default isAuthority
