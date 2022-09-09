import { Tag, Tagging } from "@aws-sdk/client-s3"
import encodeTagValue from "./encodeTagValue"
const writeTagging = <T extends Readonly<Record<string, string | null>>>(value: T): Tagging => {
    return {
        TagSet: Object.entries(value)
            .filter(([, Value]) => Value !== null && Value.length > 0)
            .map(([Key, Value]) => ({ Key, Value: encodeTagValue(Value) } as Tag)),
    }
}
export default writeTagging
