import { PutObjectCommandInput } from "@aws-sdk/client-s3"
import { invalidate, isImageMediaType, isObject, ValidationError, ValidationFaultCollector } from "@phylopic/utils"
import { ImageFile } from "../interfaces"
const isBuffer = (x: unknown, collector?: ValidationFaultCollector): x is Buffer =>
    x instanceof Buffer || invalidate(collector, "Expected a buffer.")
const validate = (x: unknown, collector?: ValidationFaultCollector): x is ImageFile =>
    isObject(x, collector) &&
    isImageMediaType((x as ImageFile).type, collector?.sub("type")) &&
    isBuffer((x as ImageFile).data, collector)
const writeImageFile = async (value: ImageFile): Promise<Partial<PutObjectCommandInput>> => {
    const collector = new ValidationFaultCollector()
    if (!validate(value, collector)) {
        throw new ValidationError(collector.list(), "Invalid payload.")
    }
    return {
        Body: value.data,
        ContentType: value.type,
    }
}
export default writeImageFile
