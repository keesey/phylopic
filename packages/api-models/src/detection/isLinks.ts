import { isObject, type ValidationFaultCollector } from "@phylopic/utils"
import { Link } from "../types"
import { Links } from "../types/Links"
export const isLinks = <TSelfLink extends Link = Link>(
    x: unknown,
    isSelfLink: (link: TSelfLink, faultCollector?: ValidationFaultCollector) => link is TSelfLink,
    faultCollector?: ValidationFaultCollector,
): x is Links<TSelfLink> => isObject(x, faultCollector) && isSelfLink((x as Links<TSelfLink>).self, faultCollector)
