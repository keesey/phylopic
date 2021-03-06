import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3"
import { SOURCE_BUCKET_NAME } from "@phylopic/source-models"
import { chunk } from "@phylopic/utils"
import { putJSON } from "@phylopic/utils-aws"
import { HealData } from "./getHealData.js"
const enact = async (
    client: S3Client,
    data: Pick<
        HealData,
        | "contributors"
        | "contributorsToPut"
        | "externals"
        | "externalsToPut"
        | "images"
        | "imagesToPut"
        | "keysToDelete"
        | "nodes"
        | "nodesToPut"
    >,
): Promise<unknown> => {
    const promises: Promise<unknown>[] = [
        ...[...data.contributorsToPut].map(uuid =>
            putJSON(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `contributors/${uuid}/meta.json`,
                },
                data.contributors.get(uuid),
            ),
        ),
        ...[...data.imagesToPut].map(uuid =>
            putJSON(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `images/${uuid}/meta.json`,
                },
                data.images.get(uuid),
            ),
        ),
        ...[...data.nodesToPut].map(uuid =>
            putJSON(
                client,
                {
                    Bucket: SOURCE_BUCKET_NAME,
                    Key: `nodes/${uuid}/meta.json`,
                },
                data.nodes.get(uuid),
            ),
        ),
        ...[...data.externalsToPut].map(async identifier => {
            const external = data.externals.get(identifier)
            if (external) {
                return await putJSON(
                    client,
                    {
                        Bucket: SOURCE_BUCKET_NAME,
                        Key: `externals/${identifier}/meta.json`,
                    },
                    external,
                )
            }
        }),
    ]
    if (data.keysToDelete.size > 0) {
        const chunked = chunk(data.keysToDelete, 1000)
        promises.push(
            Promise.all(
                chunked.map(chunk =>
                    client.send(
                        new DeleteObjectsCommand({
                            Bucket: SOURCE_BUCKET_NAME,
                            Delete: {
                                Objects: chunk.map(Key => ({ Key })),
                            },
                        }),
                    ),
                ),
            ),
        )
    }
    return Promise.all(promises)
}
export default enact
