import type { ValidationFaultCollector } from "@phylopic/utils"
import { FaultDetector, isObject } from "@phylopic/utils"
import { Link } from "../types/Link.js"
export const isLink =
    <THRef extends string>(isHRef: FaultDetector<THRef>): FaultDetector<Link<THRef>> =>
        (x: unknown, faultCollector?: ValidationFaultCollector): x is Link<THRef> =>
            isObject(x, faultCollector) && isHRef((x as Link<THRef>).href, faultCollector?.sub("href"))
export default isLink
