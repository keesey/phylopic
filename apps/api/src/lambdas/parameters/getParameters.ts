const getParameters = <T>(
    parameters: { [name: string]: string | undefined } | null,
    names: ReadonlyArray<string & keyof T>,
): Partial<T> => {
    if (!parameters) {
        return {}
    }
    const result = Object.entries(parameters)
        .map(([name, value]) => [name.toLowerCase(), value] as [string & keyof T, string | undefined])
        .reduce<Partial<T>>((prev, [name, value]) => {
            if (names.includes(name) && value !== undefined) {
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
