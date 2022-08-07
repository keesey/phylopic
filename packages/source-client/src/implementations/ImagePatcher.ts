import { GetObjectOutput, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3"
import ImageFileEditor from "./ImageFileEditor"
import Patcher from "./Patcher"
export default class ImagePatcher<T> extends Patcher<T> {
    public readonly file: ImageFileEditor
    constructor(
        getClient: () => S3Client,
        bucket: string,
        path: string,
        readOutput: (output: GetObjectOutput) => Promise<T>,
        writeOutput: (value: T) => Promise<Partial<PutObjectCommandInput>>,
    ) {
        super(getClient, bucket, path + "/meta.json", readOutput, writeOutput)
        this.file = new ImageFileEditor(getClient, bucket, path + "/source")
    }
    public async delete(): Promise<void> {
        await Promise.all([super.delete(), this.file.delete()])
    }
}
