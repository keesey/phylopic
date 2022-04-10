import { Image, ISODateTime, LicenseURL, UUID } from "phylopic-source-models/src"
import getEmailFromSubmitter from "../phylopicv1/getEmailFromSubmitter"
import { Image as ImageV1 } from "../phylopicv1/models/Image"

const convertDate = (s: string): ISODateTime => {
    const [year, month, day, hour, minute, second] = s
        .split(/\D+/g)
        .filter(Boolean)
        .map(part => parseInt(part, 10))
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second)).toISOString()
}
const toImage = (original: ImageV1, specific: UUID, general?: UUID): Image => ({
    contributor: getEmailFromSubmitter(original),
    created: convertDate(original.submitted),
    license: original.licenseURL.replace(/^http:/, "https:") as LicenseURL,
    specific,
    attribution: original.credit ?? undefined,
    general,
})
export default toImage
