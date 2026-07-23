import { invalidate, isDefined, type ValidationFaultCollector } from "@phylopic/utils"
export const hasOnlyOne = <T>(
    x: T,
    fields: ReadonlyArray<keyof T | ReadonlyArray<keyof T>>,
    collector?: ValidationFaultCollector,
) => {
    const defined = fields
        .map(field => (typeof field !== "object" ? isDefined(x[field]) : field.some(f => isDefined(x[f]))))
        .filter((x): x is true => x)
    if (defined.length > 1) {
        return invalidate(
            collector,
            `The following fields cannot be combined in the same query: ${fields
                .map(field =>
                    Array.isArray(field) ? field.map(f => JSON.stringify(f)).join("/") : JSON.stringify(field),
                )
                .join(", ")}.`,
        )
    }
    return true
}
