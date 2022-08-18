import { isArray, ValidationFaultCollector } from "@phylopic/utils"
import { ResolveExternalsPost } from "../types/ResolveExternalsPost"
import isExternalPost from "./isExternalPost"
const isResolveExternalsPost = (x: unknown, collector?: ValidationFaultCollector): x is ResolveExternalsPost => {
    return isArray(isExternalPost)(x, collector)
}
export default isResolveExternalsPost
