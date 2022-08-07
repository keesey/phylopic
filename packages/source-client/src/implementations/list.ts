import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"
import { FaultDetector } from "@phylopic/utils"
import { List } from "../interfaces"
const list = async <T extends string = string>(
    client: S3Client,
    bucket: string,
    prefix: string,
    validate: FaultDetector<T>,
    token?: string,
): Promise<List<T>> => {
    const output = await client.send(
        new ListObjectsV2Command({
            Bucket: bucket,
            Delimiter: "/",
            ContinuationToken: token,
            Prefix: prefix,
        }),
    )
    return {
        items:
            output.CommonPrefixes?.map(commonPrefix =>
                decodeURIComponent(commonPrefix.Prefix?.slice(prefix.length).replace(/\/$/, "") ?? ""),
            ).filter<T>((value): value is T => validate(value)) ?? [],
        nextToken: output.NextContinuationToken,
    }
}
export default list
