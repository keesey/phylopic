const replaceNormalized = (_key: string, value: unknown) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        return Object.keys(value)
            .filter(key => (value as Record<string, unknown>)[key] !== undefined)
            .sort()
            .reduce((prev, key) => ({ ...prev, [key]: (value as Record<string, unknown>)[key] }), {})
    }
    return value
}
export const stringifyNormalized = (o: any): string => JSON.stringify(o, replaceNormalized)
