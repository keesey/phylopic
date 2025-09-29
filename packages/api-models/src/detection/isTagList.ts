import { isTag, ValidationFaultCollector } from "@phylopic/utils"
export const isTagList = (x: unknown, faultCollector?: ValidationFaultCollector): x is string =>
    typeof x === "string" && x.length >= 2 && x.split(",").every(tag => isTag(tag, faultCollector))
