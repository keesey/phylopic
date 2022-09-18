import { Submission } from "@phylopic/source-models"
import { Hash, isHash } from "@phylopic/utils"
import { ImageFile, S3ClientProvider } from "../interfaces"
import { SourceClient } from "../interfaces/SourceClient"
import UPLOADS_BUCKET_NAME from "./s3/constants/UPLOADS_BUCKET_NAME"
import readImageFile from "./s3/io/readImageFile"
import readSubmission from "./s3/readSubmission"
import S3Deletor from "./s3/S3Deletor"
import S3TaggingPatcher from "./s3/S3TaggingPatcher"
export default class SubmissionClient
    extends S3TaggingPatcher<Submission>
    implements ReturnType<SourceClient["submission"]>
{
    constructor(provider: S3ClientProvider, hash: Hash) {
        if (!isHash(hash)) {
            throw new Error("Invalid hexadecimal hash.")
        }
        const key = `files/${encodeURIComponent(hash)}`
        super(provider, UPLOADS_BUCKET_NAME, key, readSubmission)
        this.file = new S3Deletor<ImageFile>(provider, UPLOADS_BUCKET_NAME, key, readImageFile)
    }
    file
}
