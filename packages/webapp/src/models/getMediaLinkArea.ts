import { MediaLink } from "@phylopic/api-models"
const getMediaLinkArea = (link: Pick<MediaLink, "sizes">) =>
    link.sizes
        .split("x", 2)
        .map(size => parseInt(size, 10))
        .reduce((prev, value) => prev * value, 1)
export default getMediaLinkArea
