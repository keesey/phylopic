import { Contributor } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { SourceClient } from "../interfaces/SourceClient"
import ClientProvider from "./ClientProvider"
import CONTRIBUTOR_FIELDS from "./pg/constants/CONTRIBUTOR_FIELDS"
import CONTRIBUTOR_TABLE from "./pg/constants/CONTRIBUTOR_TABLE"
import IMAGE_FIELDS from "./pg/constants/IMAGE_FIELDS"
import IMAGE_TABLE from "./pg/constants/IMAGE_TABLE"
import normalizeContributor from "./pg/normalization/normalizeContributor"
import normalizeImage from "./pg/normalization/normalizeImage"
import PGLister from "./pg/PGLister"
import PGPatcher from "./pg/PGPatcher"
import UPLOAD_BUCKET_NAME from "./s3/constants/UPLOAD_BUCKET_NAME"
import S3Lister from "./s3/S3Lister"
export default class ContributorClient
    extends PGPatcher<Contributor>
    implements ReturnType<SourceClient["contributor"]>
{
    constructor(protected provider: ClientProvider, protected uuid: UUID) {
        super(
            provider.getPG,
            CONTRIBUTOR_TABLE,
            [{ column: "uuid", type: "uuid", value: uuid }],
            CONTRIBUTOR_FIELDS,
            normalizeContributor,
        )
    }
    public accepted = new S3Lister(
        this.provider.getS3,
        UPLOAD_BUCKET_NAME,
        `contributors/${encodeURIComponent(this.uuid)}/accepted/`,
        isUUIDv4,
        32,
    )
    public images = new PGLister(this.getClient, IMAGE_TABLE, 32, IMAGE_FIELDS, normalizeImage, "created DESC", [
        {
            column: "contributor_uuid",
            type: "uuid",
            value: this.uuid,
        },
    ])
    public submitted = new S3Lister(
        this.provider.getS3,
        UPLOAD_BUCKET_NAME,
        `contributors/${encodeURIComponent(this.uuid)}/submitted/`,
        isUUIDv4,
        32,
    )
}
