import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { ImagesClient as IImagesClient } from "../interfaces/SourceClient"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import { IDField } from "./pg/fields/IDField"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGLister from "./pg/PGLister"
export default class ImagesClient extends PGLister<Image, { uuid: UUID }> implements IImagesClient {
    constructor(protected readonly provider: PGClientProvider, protected readonly where: readonly IDField[] = []) {
        super(provider, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", where)
        this.accepted = new PGLister<Image, { uuid: UUID }>(
            provider,
            IMAGE_TABLE,
            64,
            IMAGE_FIELDS,
            normalizeImage,
            "modified DESC",
            [
                ...where,
                {
                    column: "accepted",
                    type: "bit",
                    value: 1,
                },
                {
                    column: "submitted",
                    type: "bit",
                    value: 1,
                },
            ],
        )
        this.submitted = new PGLister<Image, { uuid: UUID }>(
            provider,
            IMAGE_TABLE,
            64,
            IMAGE_FIELDS,
            normalizeImage,
            "modified DESC",
            [
                ...where,
                {
                    column: "accepted",
                    type: "bit",
                    value: 0,
                },
                {
                    column: "submitted",
                    type: "bit",
                    value: 1,
                },
            ],
        )
        this.withdrawn = new PGLister<Image, { uuid: UUID }>(
            provider,
            IMAGE_TABLE,
            64,
            IMAGE_FIELDS,
            normalizeImage,
            "modified DESC",
            [
                ...where,
                {
                    column: "submitted",
                    type: "bit",
                    value: 0,
                },
            ],
        )
    }
    accepted
    submitted
    withdrawn
}
