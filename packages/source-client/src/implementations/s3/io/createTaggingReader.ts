import { Tagging } from "@aws-sdk/client-s3"
import decodeTagValue from "./decodeTagValue"
const createTaggingReader =
    <T extends Readonly<Record<string, string | null>>>(fields: ReadonlyArray<string & keyof T>) =>
    (tagging: Tagging | undefined): T => {
        return fields.reduce<Partial<T>>((prev, field) => {
            const value = tagging?.TagSet?.find(tag => tag.Key === field)?.Value
            if (typeof value === "string") {
                return { ...prev, [field]: decodeTagValue(value) }
            }
            return { ...prev, [field]: null }
        }, {}) as T
    }
export default createTaggingReader
