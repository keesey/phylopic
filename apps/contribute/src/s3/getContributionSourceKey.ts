import { UUID } from "@phylopic/utils"
import getContributionSourceKeyPrefix from "./getContributionSourceKeyPrefix"
import { ImageFileExtension } from "./ImageFileExtension"
const getContributionSourceKey = (uuid: UUID, extension: ImageFileExtension) =>
    getContributionSourceKeyPrefix(uuid) + extension
export default getContributionSourceKey
