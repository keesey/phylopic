import { EmailAddress } from "@phylopic/utils"
const getContributorMetaKey = (email: EmailAddress) => `contributors/${encodeURIComponent(email)}/meta.json`
export default getContributorMetaKey
