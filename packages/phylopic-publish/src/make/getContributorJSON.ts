import { Contributor } from "phylopic-api-models/src"
import { normalizeUUID, UUID } from "phylopic-utils/src"
import type { SourceData } from "./getSourceData"
const getContributorJSON = (uuid: UUID, data: SourceData, count: number): Contributor => {
    uuid = normalizeUUID(uuid)
    const sourceContributor = data.contributors.get(uuid)
    if (!sourceContributor) {
        throw new Error(`Source contributor not found! <${uuid}>`)
    }
    return {
        _links: {
            contact:
                sourceContributor.emailAddress && sourceContributor.showEmailAddress
                    ? {
                          href: `mailto:${sourceContributor.emailAddress}`,
                      }
                    : null,
            images: {
                href: `/images?build=${data.build}&filter_contributor=${encodeURIComponent(uuid)}`,
            },
            self: {
                href: `/contributors/${encodeURIComponent(uuid)}?build=${data.build}`,
            },
        },
        build: data.build,
        created: sourceContributor.created,
        count,
        name: sourceContributor.name,
        uuid,
    }
}
export default getContributorJSON
