import { Tag, Tagging } from "@aws-sdk/client-s3"
const writeTagging = <T extends Readonly<Record<string, string | null>>>(value: T): Tagging => {
    return {
        TagSet: Object.entries(value)
            .filter(([, Value]) => Value !== null)
            .map(([Key, Value]) => ({ Key, Value } as Tag)),
    }
}
export default writeTagging
