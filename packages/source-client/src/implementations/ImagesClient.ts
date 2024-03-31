import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import { IDField } from "./pg/fields/IDField"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGLister from "./pg/PGLister"
type IImagesClient = SourceClient["images"]
export default class ImagesClient extends PGLister<Image, { uuid: UUID }> implements IImagesClient {
    constructor(
        protected readonly provider: PGClientProvider,
        protected readonly where: readonly IDField[] = [],
    ) {
        super(provider, IMAGE_TABLE, 32, IMAGE_FIELDS, normalizeImage, 'modified DESC,created DESC,"uuid"', where)
    }
}
