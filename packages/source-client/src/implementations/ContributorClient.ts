import { Contributor } from "@phylopic/source-models"
import { isUUIDv4, UUID } from "@phylopic/utils"
import { S3ClientProvider } from "../interfaces"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import ImagesClient from "./ImagesClient"
import CONTRIBUTOR_FIELDS from "./pg/constants/CONTRIBUTOR_FIELDS"
import CONTRIBUTOR_TABLE from "./pg/constants/CONTRIBUTOR_TABLE"
import normalizeContributor from "./pg/normalization/normalizeContributor"
import PGPatcher from "./pg/PGPatcher"
import SUBMISSIONS_BUCKET_NAME from "./s3/constants/SUBMISSIONS_BUCKET_NAME"
import S3Lister from "./s3/S3Lister"
export default class ContributorClient
    extends PGPatcher<Contributor & { uuid: UUID }>
    implements ReturnType<SourceClient["contributor"]>
{
    constructor(provider: PGClientProvider & S3ClientProvider, uuid: UUID) {
        super(
            provider,
            CONTRIBUTOR_TABLE,
            [{ column: "uuid", type: "uuid", value: uuid }],
            CONTRIBUTOR_FIELDS,
            normalizeContributor,
        )
        this.images = new ImagesClient(provider, [
            {
                column: "contributor_uuid",
                type: "uuid",
                value: uuid,
            },
        ])
        this.submissions = new S3Lister(
            provider,
            SUBMISSIONS_BUCKET_NAME,
            `contributors/${encodeURIComponent(uuid)}/submissions/`,
            isUUIDv4,
        )
    }
    images
    submissions
}
