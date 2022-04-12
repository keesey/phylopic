import { ValidationFault } from "./ValidationFault"
export class ValidationFaultCollector {
    constructor(private fields: readonly string[] = [], private faults: ValidationFault[] = []) { }
    public add(message: string) {
        const field = this.fields.join(".")
        this.faults.push({ field, message })
    }
    public list() {
        return [...this.faults]
    }
    public sub(...fields: string[]) {
        if (!fields.length) {
            return this
        }
        return new ValidationFaultCollector([...this.fields, ...fields], this.faults)
    }
}
export default ValidationFaultCollector
