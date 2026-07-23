import { ReadField } from "./ReadField"
export const getFields = <T>(fields: ReadonlyArray<(string & keyof T) | ReadField<T>>) => {
    return fields
        .map(field =>
            typeof field === "string"
                ? field
                : field.column === field.property
                  ? field.column
                  : `${field.column} AS ${JSON.stringify(field.property)}`,
        )
        .join(",")
}
