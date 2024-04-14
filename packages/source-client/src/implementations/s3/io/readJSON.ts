import { GetObjectOutput } from "@aws-sdk/client-s3"
import { convertS3BodyToString } from "@phylopic/utils-aws"
export const readJSON = async <T>(output: GetObjectOutput): Promise<T> => {
    const json = await convertS3BodyToString(output.Body)
    return JSON.parse(json) as T
}
