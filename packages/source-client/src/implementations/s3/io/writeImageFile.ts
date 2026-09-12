import { PutObjectCommandInput } from "@aws-sdk/client-s3"
import {
    invalidate,
    isImageMediaType,
    isObject,
    isVectorMediaType,
    ValidationError,
    ValidationFaultCollector,
} from "@phylopic/utils"
import { sanitizeSVG } from "@phylopic/utils/svg"
import { ImageFile } from "../../../interfaces/ImageFile"
const isBuffer = (x: unknown, collector?: ValidationFaultCollector): x is Buffer =>
    x instanceof Buffer || invalidate(collector, "Expected a buffer.")
const validate = (x: unknown, collector?: ValidationFaultCollector): x is ImageFile =>
    isObject(x, collector) &&
    isImageMediaType((x as ImageFile).type, collector?.sub("type")) &&
    isBuffer((x as ImageFile).data, collector)
export const writeImageFile = async (value: ImageFile): Promise<Partial<PutObjectCommandInput>> => {
    const collector = new ValidationFaultCollector()
    if (!validate(value, collector)) {
        throw new ValidationError(collector.list(), "Invalid payload.")
    }
    const data = isVectorMediaType(value.type) ? sanitizeSVG(value.data) : value.data
    return {
        Body: data,
        ContentType: value.type,
    }
}
