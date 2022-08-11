import { Contributor } from "@phylopic/source-models"
import { UUID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces/PGClientProvider"
import { SourceClient } from "../interfaces/SourceClient"
import type { ClientProvider } from "./ClientProvider"
import ImagesClient from "./ImagesClient"
import CONTRIBUTOR_FIELDS from "./pg/constants/CONTRIBUTOR_FIELDS"
import CONTRIBUTOR_TABLE from "./pg/constants/CONTRIBUTOR_TABLE"
import normalizeContributor from "./pg/normalization/normalizeContributor"
import PGPatcher from "./pg/PGPatcher"
export default class ContributorClient
    extends PGPatcher<Contributor & { uuid: UUID }>
    implements ReturnType<SourceClient["contributor"]>
{
    constructor(provider: PGClientProvider, uuid: UUID) {
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
    }
    images
}
