import { INCOMPLETE_STRING } from "@phylopic/source-models"
import { EmailAddress, UUID } from "@phylopic/utils"
import { randomUUID } from "crypto"
import type SourceClient from "~/source/SourceClient"

/** Prefer an existing contributor row for this email; otherwise use `preferred` or a new UUID. */
export const resolveContributorUuidForEmail = async (
    client: SourceClient,
    email: EmailAddress,
    preferred?: UUID,
): Promise<UUID> => {
    const byEmail = client.contributors.byEmail(email)
    if (await byEmail.exists()) {
        return (await byEmail.get()).uuid
    }
    return preferred ?? randomUUID()
}

/** Ensure a contributor row exists for this email without violating contributor_email_key. */
export const ensureContributorForEmail = async (
    client: SourceClient,
    uuid: UUID,
    email: EmailAddress,
): Promise<UUID> => {
    const byEmail = client.contributors.byEmail(email)
    if (await byEmail.exists()) {
        return (await byEmail.get()).uuid
    }
    const contributor = client.contributor(uuid)
    const existing = (await contributor.exists()) ? await contributor.get() : null
    if (existing?.emailAddress === email) {
        return uuid
    }
    await contributor.put({
        created: existing?.created ?? new Date().toISOString(),
        name: existing?.name ?? INCOMPLETE_STRING,
        showEmailAddress: existing?.showEmailAddress ?? true,
        ...existing,
        emailAddress: email,
        modified: new Date().toISOString(),
        uuid,
    })
    return uuid
}
