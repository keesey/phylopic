import { EmailAddress } from "@phylopic/utils"
const getContributorSubmissionsKeyPrefix = (email: EmailAddress) =>
    `contributors/${encodeURIComponent(email)}/submissions/`
export default getContributorSubmissionsKeyPrefix
