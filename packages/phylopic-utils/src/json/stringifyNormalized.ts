// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replaceNormalized = (_key: string, value: any) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return Object.keys(value)
            .filter(key => value[key] !== undefined)
            .sort()
            .reduce((prev, key) => ({ ...prev, [key]: value[key] }), {})
    }
    return value
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyNormalized = (o: any): string => JSON.stringify(o, replaceNormalized)
export default stringifyNormalized
