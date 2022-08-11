import { Image } from "@phylopic/source-models"
import { ClientBase } from "pg"
import { ImagesClient as IImagesClient } from "../interfaces/SourceClient"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import { IdentifyingField } from "./pg/fields/IdentifyingField"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGLister from "./pg/PGLister"
export default class ImagesClient extends PGLister<Image> implements IImagesClient {
    constructor(protected getClient: () => ClientBase, protected where: readonly IdentifyingField[] = []) {
        super(getClient, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", where)
    }
    accepted = new PGLister<Image>(this.getClient, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", [
        ...this.where,
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
    ])
    submitted = new PGLister<Image>(this.getClient, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", [
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
    ])
    withdrawn = new PGLister<Image>(this.getClient, IMAGE_TABLE, 64, IMAGE_FIELDS, normalizeImage, "modified DESC", [
        ...this.where,
        {
            column: "submitted",
            type: "bit",
            value: 0,
        },
    ])
}
