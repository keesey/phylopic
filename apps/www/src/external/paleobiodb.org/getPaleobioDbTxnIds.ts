import { NodeLinks } from "@phylopic/api-models"
const LINK_PREFIX = "/resolve/paleobiodb.org/txn/"
const getPaleobioDbTxnIds = (links: NodeLinks) => {
    return links.external
        ?.filter(({ href }) => href.startsWith(LINK_PREFIX))
        .map(({ href }) => href.slice(LINK_PREFIX.length).split("?", 2)[0])
        .filter(Boolean)
        .map(s => decodeURIComponent(s))
}
export default getPaleobioDbTxnIds
