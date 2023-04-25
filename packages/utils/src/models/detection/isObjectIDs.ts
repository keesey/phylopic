import { invalidate } from "../../validation"
import type ValidationFaultCollector from "../../validation/ValidationFaultCollector"
import { ObjectIDs } from "../types/ObjectIDs"
import isObjectID from "./isObjectID"
export const isObjectIDs = (x: unknown, faultCollector?: ValidationFaultCollector): x is ObjectIDs => {
    if (typeof x === "string") {
        const ids = x.split(",")
        if (ids.length === 0) {
            return invalidate(faultCollector, "No object IDs provided.")
        }
        for (let i = 0; i < ids.length; ++i) {
            if (!isObjectID(ids[i], faultCollector?.sub(String(i)))) {
                return false
            }
        }
        return true
    }
    return invalidate(faultCollector, "Not a string.")
}
export default isObjectIDs
