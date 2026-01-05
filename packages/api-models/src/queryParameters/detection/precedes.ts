import { invalidate, isDefined, ValidationFaultCollector } from "@phylopic/utils"
export const precedes = <T>(
    x: T,
    predecessorField: keyof T,
    successorField: keyof T,
    collector?: ValidationFaultCollector,
) => {
    const prcValue = x[predecessorField]
    const sucValue = x[successorField]
    if (isDefined(prcValue) && isDefined(sucValue) && prcValue > sucValue) {
        return invalidate(
            collector,
            `The value of ${JSON.stringify(predecessorField)} cannot be more than the value of ${JSON.stringify(
                successorField,
            )}.`,
        )
    }
    return true
}
