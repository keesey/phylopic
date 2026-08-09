import { S3Client } from "@aws-sdk/client-s3"
import { putJSONString } from "@phylopic/utils-aws"
import { UUID } from "@phylopic/utils"
import Bottleneck from "bottleneck"
import { ENTITIES_CACHE_CONTROL, getEntitiesBucket } from "./constants.js"
import { EntityFolder, getEntityJSONKey } from "./getEntityJSONKey.js"
const UPLOAD_CONCURRENCY = 50
interface PendingUpload {
    body: string
    folder: EntityFolder
    uuid: UUID
}
export class EntityS3Writer {
    private readonly bucket = getEntitiesBucket()
    private readonly build: number
    private readonly client = new S3Client({})
    private readonly limiter = new Bottleneck({ maxConcurrent: UPLOAD_CONCURRENCY })
    private readonly pending: PendingUpload[] = []
    constructor(build: number) {
        this.build = build
    }
    put(folder: EntityFolder, uuid: UUID, body: string) {
        this.pending.push({ body, folder, uuid })
    }
    async flush() {
        await Promise.all(
            this.pending.map(({ body, folder, uuid }) =>
                this.limiter.schedule(() =>
                    putJSONString(
                        this.client,
                        {
                            Bucket: this.bucket,
                            CacheControl: ENTITIES_CACHE_CONTROL,
                            Key: getEntityJSONKey(this.build, folder, uuid),
                        },
                        body,
                    ),
                ),
            ),
        )
        await this.limiter.stop({ dropWaitingJobs: false })
    }
}
