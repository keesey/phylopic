import { UUID } from "@phylopic/utils"
import getSubmissionsPrefix from "./getSubmissionsPrefix"
const getSubmissionSourceKey = (contributorUUID: UUID, imageUUID: UUID) =>
    getSubmissionsPrefix(contributorUUID) + encodeURIComponent(imageUUID) + "/source"
export default getSubmissionSourceKey
