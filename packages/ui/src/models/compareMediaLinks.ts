import { MediaLink } from "@phylopic/api-models"
import { getMediaLinkArea } from "./getMediaLinkArea"
export const compareMediaLinks = (a: MediaLink, b: MediaLink) => getMediaLinkArea(a) - getMediaLinkArea(b)
