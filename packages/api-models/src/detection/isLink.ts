import { FaultDetector, isObject, type ValidationFaultCollector } from "@phylopic/utils"
import { type Link } from "../types/Link"
export const isLink =
    <THRef extends string>(isHRef: FaultDetector<THRef>): FaultDetector<Link<THRef>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is Link<THRef> =>
        isObject(x, faultCollector) && isHRef((x as Link<THRef>).href, faultCollector?.sub("href"))
