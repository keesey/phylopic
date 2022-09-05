import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { ImageFile } from "../interfaces/ImageFile"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { S3ClientProvider } from "../interfaces/S3ClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGPatcher from "./pg/PGPatcher"
import SOURCE_IMAGES_BUCKET_NAME from "./s3/constants/SOURCE_IMAGES_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import writeImageFile from "./s3/io/writeImageFile"
import S3Editor from "./s3/S3Editor"
export default class ImageClient
    extends PGPatcher<Image & { uuid: UUID }>
    implements ReturnType<SourceClient["image"]>
{
    constructor(protected readonly provider: PGClientProvider & S3ClientProvider, protected readonly uuid: UUID) {
        super(provider, IMAGE_TABLE, [{ column: "uuid", type: "uuid", value: uuid }], IMAGE_FIELDS, normalizeImage)
        this.file = new S3Editor<ImageFile>(
            provider,
            SOURCE_IMAGES_BUCKET_NAME,
            `images/${encodeURIComponent(this.uuid)}/source`,
            readImageFile,
            writeImageFile,
        )
    }
    file
}
