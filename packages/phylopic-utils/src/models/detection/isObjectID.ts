import { ObjectID } from "../types"
import { isNormalizedText } from "./isNormalizedText"
const isObjectID: (x: unknown) => x is ObjectID = isNormalizedText
export default isObjectID
