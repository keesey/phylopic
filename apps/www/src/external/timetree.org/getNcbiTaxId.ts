import { NodeLinks } from "@phylopic/api-models"
const LINK_PREFIX = "/resolve/ncbi.nlm.nih.gov/taxid/"
const getNcbiTaxId = (links: NodeLinks) => {
    const external = links.external
    const link = external?.find(({ href }) => href.startsWith(LINK_PREFIX))
    return link?.href.slice(LINK_PREFIX.length).split("?", 2)[0] ?? null
}
export default getNcbiTaxId
