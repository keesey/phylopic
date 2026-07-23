import { GetObjectOutput } from "@aws-sdk/client-s3"
import { JWT } from "@phylopic/source-models"
import { convertS3BodyToString } from "@phylopic/utils-aws"
export const readJWT = async (output: GetObjectOutput): Promise<JWT> => {
    return await convertS3BodyToString(output.Body)
}
