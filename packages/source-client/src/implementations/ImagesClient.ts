import { Image } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { ClientBase } from "pg"
import { ImagesClient as IImagesClient } from "../interfaces/SourceClient"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import { IdentifyingField } from "./pg/fields/IdentifyingField"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGLister from "./pg/PGLister"
export default class ImagesClient extends PGLister<Image, { uuid: UUID }> implements IImagesClient {
    constructor(protected readonly getClient: () => ClientBase, protected readonly where: readonly IdentifyingField[] = []) {
        super(getClient, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", where)
        this.accepted = new PGLister<Image, { uuid: UUID }>(
            getClient,
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
            getClient,
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
            getClient,
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
    submitted = new PGLister<Image, { uuid: UUID }>(
        this.getClient,
        IMAGE_TABLE,
        64,
        IMAGE_FIELDS,
        normalizeImage,
        "modified DESC",
        [
            ...this.where,
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
    withdrawn = new PGLister<Image, { uuid: UUID }>(
        this.getClient,
        IMAGE_TABLE,
        64,
        IMAGE_FIELDS,
        normalizeImage,
        "modified DESC",
        [
            ...this.where,
            {
                column: "submitted",
                type: "bit",
                value: 0,
            },
        ],
    )
}
