import { S3Client } from "@aws-sdk/client-s3"
import { putJSONString } from "@phylopic/utils-aws"
import { UUID } from "@phylopic/utils"
import Bottleneck from "bottleneck"
import { ENTITIES_CACHE_CONTROL, ENTITIES_BUCKET } from "./constants.js"
import { EntityFolder, getEntityJSONKey } from "./getEntityJSONKey.js"
import { getStaticJSONKey, StaticJSONName } from "./getStaticJSONKey.js"
const UPLOAD_CONCURRENCY = 50
interface PendingUpload {
    body: string
    folder: EntityFolder
    uuid: UUID
}
interface PendingStaticUpload {
    body: string
    name: StaticJSONName
}
export class EntityS3Writer {
    private readonly build: number
    private readonly client = new S3Client({})
    private readonly limiter = new Bottleneck({ maxConcurrent: UPLOAD_CONCURRENCY })
    private readonly pending: PendingUpload[] = []
    private readonly staticPending: PendingStaticUpload[] = []
    constructor(build: number) {
        this.build = build
    }
    put(folder: EntityFolder, uuid: UUID, body: string) {
        this.pending.push({ body, folder, uuid })
    }
    putStatic(name: StaticJSONName, body: string) {
        this.staticPending.push({ body, name })
    }
    async flush() {
        await Promise.all([
            ...this.pending.map(({ body, folder, uuid }) =>
                this.limiter.schedule(() =>
                    putJSONString(
                        this.client,
                        {
                            Bucket: ENTITIES_BUCKET,
                            CacheControl: ENTITIES_CACHE_CONTROL,
                            Key: getEntityJSONKey(this.build, folder, uuid),
                        },
                        body,
                    ),
                ),
            ),
            ...this.staticPending.map(({ body, name }) =>
                this.limiter.schedule(() =>
                    putJSONString(
                        this.client,
                        {
                            Bucket: ENTITIES_BUCKET,
                            CacheControl: ENTITIES_CACHE_CONTROL,
                            Key: getStaticJSONKey(this.build, name),
                        },
                        body,
                    ),
                ),
            ),
        ])
        await this.limiter.stop({ dropWaitingJobs: false })
    }
}
