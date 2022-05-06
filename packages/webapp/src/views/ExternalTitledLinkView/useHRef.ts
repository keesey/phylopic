import { useMemo } from "react"
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
const useHRef = (resolveHRef: string) => {
    return useMemo(() => {
        const path = resolveHRef.replace(/^\/resolve\//, "")
        const [authority, namespace, objectID] = path.split("/", 3)
        const resolve = RESOLVERS[authority + "/" + namespace]
        return resolve?.(objectID)
    }, [resolveHRef])
}
export default useHRef
