import { invalidate, isNomen, isObject, isUUIDv4, ValidationFaultCollector } from "@phylopic/utils"
import { NodePost } from "../types/NodePost"
const isNodePost = (x: unknown, collector?: ValidationFaultCollector): x is NodePost =>
    (isObject(x, collector) || invalidate(collector, "Invalid request body")) &&
    isNomen((x as NodePost).name, collector?.sub("name")) &&
    isUUIDv4((x as NodePost).parent, collector?.sub("parent"))
export default isNodePost
