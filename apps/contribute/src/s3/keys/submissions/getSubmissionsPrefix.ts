import { UUID } from "@phylopic/utils"
const getSubmissionsPrefix = (uuid: UUID) => `contributors/${encodeURIComponent(uuid)}/submissions/`
export default getSubmissionsPrefix
