import { ReadField } from "./ReadField"
const getFields = <T>(fields: ReadonlyArray<(string & keyof T) | ReadField<T>>) => {
    return fields
        .map(field =>
            typeof field === "string"
                ? field
                : field.column === field.property
                ? field.column
                : `${field.column} AS ${field.property}`,
        )
        .join(",")
}
export default getFields
