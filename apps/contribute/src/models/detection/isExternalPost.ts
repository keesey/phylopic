import { invalidate, isAuthority, isNamespace, isObject, isObjectID, ValidationFaultCollector } from "@phylopic/utils"
import { ExternalPost } from "../types/ExternalPost"
const isExternalPost = (x: unknown, collector?: ValidationFaultCollector): x is ExternalPost => {
    if (x === undefined) {
        return true
    }
    return (
        (isObject(x, collector) || invalidate(collector, "Invalid request body")) &&
        isAuthority((x as ExternalPost).authority, collector?.sub("authority")) &&
        isNamespace((x as ExternalPost).namespace, collector?.sub("namespace")) &&
        isObjectID((x as ExternalPost).objectID, collector?.sub("objectID"))
    )
}
export default isExternalPost
