import { PutObjectCommandInput } from "@aws-sdk/client-s3"
import { FaultDetector, stringifyNormalized, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
const createJSONWriter =
    <T>(validator: FaultDetector<T>) =>
    async (value: T): Promise<Partial<PutObjectCommandInput>> => {
        const collector = new ValidationFaultCollector()
        if (!validator(value, collector)) {
            throw new ValidationError(collector.list(), "Invalid payload.")
        }
        return {
            Body: stringifyNormalized(value),
            ContentType: "application/json",
        }
    }
export default createJSONWriter
