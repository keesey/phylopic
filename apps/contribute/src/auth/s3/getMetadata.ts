import { GetObjectCommand, GetObjectCommandOutput, GetObjectTaggingCommand, S3Client } from "@aws-sdk/client-s3"
import { EmailAddress } from "@phylopic/utils"
import { streamToString } from "@phylopic/utils-aws"
import { Readable } from "stream"
import getContributorMetaKey from "~/s3/keys/contribute/getContributorMetaKey"
import Payload from "../models/Payload"
const getMetadata = async (client: S3Client, email: EmailAddress, verify = false): Promise<Payload> => {
    const options = {
        Bucket: "contribute.phylopic.org",
        Key: getContributorMetaKey(email),
    }
    let response: GetObjectCommandOutput
    try {
        response = await client.send(new GetObjectCommand(options))
    } catch (e) {
        if (typeof (e as any)?.$metadata?.httpStatusCode === "number") {
            throw (e as any).$metadata.httpStatusCode as number
        }
        throw e
    }
    if (!response.Body) {
        throw 401
    }
    const payload = JSON.parse(await streamToString(response.Body as Readable)) as Payload
    if (verify) {
        const taggingResponse = await client.send(new GetObjectTaggingCommand(options))
        if (!taggingResponse.TagSet?.find(tag => tag.Key === "verified" && tag.Value === "true")) {
            throw 401
        }
    }
    return {
        uuid: payload.uuid,
    }
}
export default getMetadata
