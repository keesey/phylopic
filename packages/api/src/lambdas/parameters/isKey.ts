const isKey = <T>(value: string, values: ReadonlyArray<string & keyof T>): value is string & keyof T =>
    values.includes(value as string & keyof T)
export default isKey
