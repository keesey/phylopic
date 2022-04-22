import { isObject } from "phylopic-utils/src/detection"
import { FaultDetector } from "phylopic-utils/src/detection/FaultDetector"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import { Link } from "../types/Link"
export const isLink =
    <THRef extends string>(isHRef: FaultDetector<THRef>): FaultDetector<Link<THRef>> =>
    (x: unknown, faultCollector?: ValidationFaultCollector): x is Link<THRef> =>
        isObject(x, faultCollector) && isHRef((x as Link<THRef>).href, faultCollector?.sub("href"))
export default isLink
