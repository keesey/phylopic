import { Tagging } from "@aws-sdk/client-s3"
const readTagging = <T extends Readonly<Record<string, string | undefined>>>(tagging: Tagging | undefined): T => {
    return (tagging?.TagSet?.reduce<Partial<T>>(
        (prev, item) => (item.Key ? { ...prev, [item.Key]: item.Value } : prev),
        {} as Partial<T>,
    ) ?? {}) as T
}
export default readTagging
