import { ValidationFault } from "./ValidationFault"
export const validateLinks = (links: unknown) => {
    const faults: ValidationFault[] = []
    if (!links || typeof links !== "object") {
        faults.push({
            field: "_links",
            message: 'Invalid "_links" object.',
        })
    }
    return faults as readonly ValidationFault[]
}
export default validateLinks
