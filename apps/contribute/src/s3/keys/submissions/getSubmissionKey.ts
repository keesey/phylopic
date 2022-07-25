import { UUID } from "@phylopic/utils"
import getSubmissionsPrefix from "./getSubmissionsPrefix"
const getSubmissionKey = (contributorUUID: UUID, imageUUID: UUID) =>
    getSubmissionsPrefix(contributorUUID) + encodeURIComponent(imageUUID) + "/meta.json"
export default getSubmissionKey
