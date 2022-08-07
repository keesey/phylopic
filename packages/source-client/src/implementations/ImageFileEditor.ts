import { S3Client } from "@aws-sdk/client-s3"
import { ImageFile } from "../interfaces"
import readImageFile from "../io/readImageFile"
import writeImageFile from "../io/writeImageFile"
import Editor from "./Editor"
export default class ImageFileEditor extends Editor<ImageFile> {
    constructor(getClient: () => S3Client, bucket: string, key: string) {
        super(getClient, bucket, key, readImageFile, writeImageFile)
    }
}
