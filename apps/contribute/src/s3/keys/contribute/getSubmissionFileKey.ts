import { UUID } from "@phylopic/utils"
import { ImageFileExtension } from "../../ImageFileExtension"
import getSubmissionFileKeyPrefix from "./getSubmissionFileKeyPrefix"
const getSubmissionFileKey = (uuid: UUID, extension: ImageFileExtension) => getSubmissionFileKeyPrefix(uuid) + extension
export default getSubmissionFileKey
