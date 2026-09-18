import type { FaultDetector } from "../../detection/FaultDetector"
import { isNormalizedText } from "../../detection/isNormalizedText"
import type { Authority } from "../types/Authority"

export const isAuthority: FaultDetector<Authority> = isNormalizedText
