import type ValidationFaultCollector from "./ValidationFaultCollector.js"
export const invalidate = (collector: ValidationFaultCollector | undefined, message: string) => {
    collector?.add(message)
    return false
}
export default invalidate
