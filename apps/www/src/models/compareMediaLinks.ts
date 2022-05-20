import { MediaLink } from "@phylopic/api-models"
import getMediaLinkArea from "./getMediaLinkArea"
const compareMediaLinks = (a: MediaLink, b: MediaLink) => getMediaLinkArea(a) - getMediaLinkArea(b)
export default compareMediaLinks
