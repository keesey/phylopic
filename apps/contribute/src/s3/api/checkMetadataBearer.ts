import { MetadataBearer } from "@aws-sdk/types"
const checkMetadataBearer = (bearer: MetadataBearer) => {
    if (typeof bearer.$metadata.httpStatusCode === "number" && bearer.$metadata.httpStatusCode >= 400) {
        throw bearer.$metadata.httpStatusCode
    }
}
export default checkMetadataBearer
