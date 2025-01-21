import { invalidate } from "../../validation/invalidate"
import { type ValidationFaultCollector } from "../../validation/ValidationFaultCollector"
import { Tag } from "../types/Tag"
export const isTag = (value: unknown, faultCollector?: ValidationFaultCollector): value is Tag =>
    (typeof value === "string" && /^[a-z0-9 -]{2,}$/.test(value)) || invalidate(faultCollector, "Not a valid tag.")
