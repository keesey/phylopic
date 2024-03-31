import { type Submission } from "@phylopic/source-models"
import createTaggingReader from "./io/createTaggingReader"
const readSubmission = createTaggingReader<Submission>([
    "attribution",
    "contributor",
    "created",
    "identifier",
    "license",
    "newTaxonName",
    "sponsor",
    "status",
])
export default readSubmission
