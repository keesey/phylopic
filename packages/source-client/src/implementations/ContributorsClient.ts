import { Contributor } from "@phylopic/source-models"
import { EmailAddress, isEmailAddress, UUID } from "@phylopic/utils"
import { PGClientProvider } from "../interfaces"
import { ContributorsClient as IContributorsClient } from "../interfaces/SourceClient"
import CONTRIBUTOR_FIELDS from "./pg/constants/CONTRIBUTOR_FIELDS"
import CONTRIBUTOR_TABLE from "./pg/constants/CONTRIBUTOR_TABLE"
import normalizeContributor from "./pg/normalization/normalizeContributor"
import PGLister from "./pg/PGLister"
import PGPatcher from "./pg/PGPatcher"
export class ContributorsClient extends PGLister<Contributor, { uuid: UUID }> implements IContributorsClient {
    constructor(provider: PGClientProvider) {
        super(provider, CONTRIBUTOR_TABLE, 128, CONTRIBUTOR_FIELDS, normalizeContributor)
    }
    byEmail(email: EmailAddress) {
        if (!isEmailAddress(email)) {
            throw new Error("Expected an email address.")
        }
        return new PGPatcher(
            this.provider,
            CONTRIBUTOR_TABLE,
            [{ column: "email", type: "character varying", value: email }],
            CONTRIBUTOR_FIELDS,
            normalizeContributor,
        )
    }
}
