import { isArray, isTag, ValidationFaultCollector } from "@phylopic/utils"
import { Tags } from "../types"
import { Image } from "../types/Image"
import { isData } from "./isData"
export const isTags = (x: unknown, faultCollector?: ValidationFaultCollector): x is Tags =>
    isData(x, faultCollector) && isArray(isTag)((x as Image).tags, faultCollector?.sub("tags"))
