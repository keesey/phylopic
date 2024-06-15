import { GetObjectOutput } from "@aws-sdk/client-s3"
import { isImageMediaType } from "@phylopic/utils"
import { convertS3BodyToBuffer } from "@phylopic/utils-aws"
import { ImageFile } from "../../../interfaces/ImageFile"
export const readImageFile = async (output: GetObjectOutput): Promise<ImageFile> => {
    const type = output.ContentType
    if (!isImageMediaType(type)) {
        throw new Error("Invalid image media type: " + type)
    }
    return {
        data: await convertS3BodyToBuffer(output.Body),
        type,
    }
}
