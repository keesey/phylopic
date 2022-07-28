import { GetObjectCommandInput, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { FaultDetector, stringifyNormalized, ValidationFaultCollector } from "@phylopic/utils"
import { getJSON } from "@phylopic/utils-aws"
import { NextApiRequest, NextApiResponse } from "next"
import checkMetadataBearer from "./checkMetadataBearer"
const handlePatch = async (
    req: NextApiRequest,
    res: NextApiResponse<string>,
    client: S3Client,
    input: GetObjectCommandInput,
    detector?: FaultDetector<unknown>,
) => {
    const newValue = req.body
    const [oldValue, oldOutput] = await getJSON<object>(client, input)
    checkMetadataBearer(oldOutput)
    const value = {
        ...oldValue,
        ...newValue,
    }
    if (detector) {
        const collector = new ValidationFaultCollector()
        if (!detector(value, collector)) {
            console.error(collector.list())
            throw 400
        }
    }
    const output = await client.send(
        new PutObjectCommand({
            ...input,
            Body: stringifyNormalized(value),
        }),
    )
    checkMetadataBearer(output)
    output.ETag && res.setHeader("etag", output.ETag)
    res.status(204)
}
export default handlePatch
