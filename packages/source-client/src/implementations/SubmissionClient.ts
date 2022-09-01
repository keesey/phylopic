import { Submission } from "@phylopic/source-models"
import { Hash } from "@phylopic/utils"
import { ImageFile, S3ClientProvider } from "../interfaces"
import { SourceClient } from "../interfaces/SourceClient"
import UPLOADS_BUCKET_NAME from "./s3/constants/UPLOADS_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import S3Deletor from "./s3/S3Deletor"
import S3TaggingPatcher from "./s3/S3TaggingPatcher"
export default class SubmissionClient
    extends S3TaggingPatcher<Submission>
    implements ReturnType<SourceClient["submission"]>
{
    constructor(provider: S3ClientProvider, hash: Hash) {
        const key = `files/${encodeURIComponent(hash)}`
        super(provider, UPLOADS_BUCKET_NAME, key)
        this.file = new S3Deletor<ImageFile>(provider, UPLOADS_BUCKET_NAME, key, readImageFile)
    }
    file
}
