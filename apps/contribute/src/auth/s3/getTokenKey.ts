import { EmailAddress } from "@phylopic/utils";
const getTokenKey = (email: EmailAddress) => `emails/${encodeURIComponent(email)}/token.jwt`
export default getTokenKey
