import { UUID } from "@phylopic/utils"
import { ImageFileExtension } from "../../ImageFileExtension"
import getImageFileKeyPrefix from "./getImageFileKeyPrefix"
const getImageFileKey = (uuid: UUID, extension: ImageFileExtension) => getImageFileKeyPrefix(uuid) + extension
export default getImageFileKey
