import { invalidate, isDefined, ValidationFaultCollector } from "@phylopic/utils"
const hasOnlyOne = <T>(x: T, fields: ReadonlyArray<keyof T>, collector?: ValidationFaultCollector) => {
    const defined = fields.map(field => x[field]).filter(isDefined)
    if (defined.length > 1) {
        return invalidate(
            collector,
            `The following fields cannot be combined in the same query: ${fields
                .map(field => JSON.stringify(field))
                .join(", ")}.`,
        )
    }
    return true
}
export default hasOnlyOne
