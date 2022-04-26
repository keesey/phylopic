import { FaultDetector, ValidationFaultCollector } from "phylopic-utils"
import readBuffer from "./readBuffer"
export type Validator<T> = (object: T) => void
const readJSON = async <T>(filePath: string, detect?: FaultDetector<T>) => {
    const buffer = await readBuffer(filePath)
    const json = buffer.toString()
    const object = JSON.parse(json)
    const faultCollector = new ValidationFaultCollector()
    if (detect && !detect(object, faultCollector)) {
        console.error("Faults detected in object read from JSON.")
        console.error("JSON: ", json)
        console.error("Faults: ", faultCollector.list())
        throw new Error()
    }
    return object as T
}
export default readJSON
