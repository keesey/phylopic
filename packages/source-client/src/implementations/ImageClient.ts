import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { ImageFile } from "../interfaces/ImageFile"
import { SourceClient } from "../interfaces/SourceClient"
import type { ClientProvider } from "./ClientProvider"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGPatcher from "./pg/PGPatcher"
import UPLOAD_BUCKET_NAME from "./s3/constants/UPLOAD_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import writeImageFile from "./s3/io/writeImageFile"
import S3Editor from "./s3/S3Editor"
export default class ImageClient
    extends PGPatcher<Image & { uuid: UUID }>
    implements ReturnType<SourceClient["image"]>
{
    constructor(protected readonly provider: ClientProvider, protected readonly uuid: UUID) {
        super(
            provider.getPG,
            IMAGE_TABLE,
            [{ column: "uuid", type: "uuid", value: uuid }],
            IMAGE_FIELDS,
            normalizeImage,
        )
        this.file = new S3Editor<ImageFile>(
            provider.getS3,
            UPLOAD_BUCKET_NAME,
            `images/${encodeURIComponent(this.uuid)}/source`,
            readImageFile,
            writeImageFile,
        )
    }
    file
}
