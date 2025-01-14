import { UUID } from "@phylopic/utils"
import { Image, Submission } from "../types"
export const getImage = (submission: Submission & { submitted: true }, specific: UUID): Image => {
    return {
        attribution: submission.attribution ?? null,
        contributor: submission.contributor,
        created: submission.created,
        general: null,
        license: submission.license!,
        modified: submission.created,
        specific,
        sponsor: submission.sponsor ?? null,
        unlisted: false,
    }
}
