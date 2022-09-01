import { Tag, Tagging } from "@aws-sdk/client-s3"
const writeTagging = <T extends Readonly<Record<string, string | undefined>>>(value: T): Tagging => {
    return {
        TagSet: Object.entries(value).map(([Key, Value]) => ({ Key, Value } as Tag)),
    }
}
export default writeTagging
