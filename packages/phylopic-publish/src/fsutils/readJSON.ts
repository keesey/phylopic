import { FaultDetector } from "phylopic-utils/src/detection"
import { ValidationFaultCollector } from "phylopic-utils/src/validation"
import readBuffer from "./readBuffer"
export type Validator<T> = (object: T) => void
const readJSON = async <T>(filePath: string, detect?: FaultDetector<T>) => {
    const buffer = await readBuffer(filePath)
    const object = JSON.parse(buffer.toString()) as T
    const faultCollector = new ValidationFaultCollector()
    if (detect && !detect(object, faultCollector)) {
        throw new Error(faultCollector?.list().join("\n\n") || "Invalid object.")
    }
    return object
}
export default readJSON
