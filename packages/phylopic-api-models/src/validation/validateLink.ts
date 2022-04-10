import { Link } from "../models/Link"
import { ValidationFault } from "./ValidationFault"
export const validateLink = (link: Link | null, property: string, required = false) => {
    const faults: ValidationFault[] = []
    if (link === null) {
        if (required) {
            faults.push({
                field: `_links.${property}`,
                message: `A "${property}" link is required.`,
            })
        }
    } else if (typeof link !== "object") {
        faults.push({
            field: `_links.${property}`,
            message: `The "${property}" link is not an object.`,
        })
    } else if (!link.href || typeof link.href !== "string") {
        faults.push({
            field: `_links.${property}.href`,
            message: `The "${property}" link has an invalid hypertext reference.`,
        })
    }
    return faults as readonly ValidationFault[]
}
export default validateLink
