import { NodeLinks } from "@phylopic/api-models"
const LINK_PREFIX = "/resolve/ncbi.nlm.nih.gov/taxid/"
const getNcbiTaxIds = (links: NodeLinks) => {
    return links.external
        ?.filter(({ href }) => href.startsWith(LINK_PREFIX))
        .map(({ href }) => href.slice(LINK_PREFIX.length).split("?", 2)[0])
        .filter(Boolean)
        .map(s => decodeURIComponent(s))
}
export default getNcbiTaxIds
