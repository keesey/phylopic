import { Submission } from "@phylopic/source-models"
import { getImageFileExtension, Hash, ImageMediaType, SHORT_LICENSE_NAMES } from "@phylopic/utils"
const getSubmissionFilename = (submission: Submission & { hash: Hash }, contentType: ImageMediaType) => {
    return [
        submission.hash,
        submission.attribution || "Anonymous",
        submission.license ? SHORT_LICENSE_NAMES[submission.license] : "unlicensed",
        getImageFileExtension(contentType),
    ]
        .map(x => encodeURIComponent(x))
        .join(".")
}
export default getSubmissionFilename
