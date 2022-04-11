import { Namespace } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isNamespace: (x: unknown) => x is Namespace = isNormalizedText
export default isNamespace
