import readBuffer from "./readBuffer"
export type Validator<T> = (object: T) => void
const readJSON = async <T>(filePath: string, validate?: Validator<T>) => {
    const buffer = await readBuffer(filePath)
    const object = JSON.parse(buffer.toString()) as T
    validate?.(object)
    return object
}
export default readJSON
