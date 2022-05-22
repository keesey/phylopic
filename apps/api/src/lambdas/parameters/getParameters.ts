import isKey from "./isKey.js"
const getParameters = <T>(
    parameters: { [name: string]: string | undefined } | null,
    names: ReadonlyArray<string & keyof T>,
): Partial<T> => {
    if (!parameters) {
        return {}
    }
    const result = Object.entries(parameters).reduce<Partial<T>>((prev, [name, value]) => {
        if (isKey<T>(name, names) && value !== undefined) {
            return {
                ...prev,
                [name as keyof T]: value,
            }
        }
        return prev
    }, {})
    return result
}
export default getParameters
