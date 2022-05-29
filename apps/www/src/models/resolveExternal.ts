import { Authority, Namespace, ObjectID } from "@phylopic/utils"
const RESOLVERS: Readonly<Record<string, ((id: string) => string) | undefined>> = {
    ["eol.org/pages"]: id => `https://www.eol.org/pages/${encodeURIComponent(id)}`,
    ["gbif.org/species"]: id => `https://www.gbif.org/species/${encodeURIComponent(id)}`,
    ["irmng.org/taxname"]: id => `https://www.irmng.org/aphia.php?p=taxdetails&id=${encodeURIComponent(id)}`,
    ["marinespecies.org/taxname"]: id =>
        `https://www.marinespecies.org/aphia.php?p=taxdetails&id=${encodeURIComponent(id)}`,
    ["ncbi.nlm.nih.gov/taxid"]: id => `https://www.ncbi.nlm.nih.gov/data-hub/taxonomy/${encodeURIComponent(id)}/`,
    ["opentreeoflife.org/taxonomy"]: id =>
        `https://tree.opentreeoflife.org/taxonomy/browse?id=${encodeURIComponent(id)}`,
    ["phylopic.org/nodes"]: uuid => `/nodes/${encodeURIComponent(uuid)}`,
    ["phylopic.org/images"]: uuid => `/images/${encodeURIComponent(uuid)}`,
    ["ubio.org/namebank"]: id => `http://www.ubio.org/browser/details.php?namebankID=${encodeURIComponent(id)}`,
}
const resolveExternal = (authority: Authority, namespace: Namespace, objectID: ObjectID) => {
    const resolve = RESOLVERS[encodeURIComponent(authority) + "/" + encodeURIComponent(namespace)]
    return resolve?.(objectID)
}
export default resolveExternal
