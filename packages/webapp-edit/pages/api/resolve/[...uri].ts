import { NextApiHandler } from "next"

const UUID_PREFIX = "urn:uuid:"
const LSID_PREFIX = "urn:lsid:ubio.org:"
const NAMEBANK_PREFIX = "urn:lsid:ubio.org:namebank:"
const resolve: NextApiHandler = async (req, res) => {
    const uri = Array.isArray(req.query.uri)
        ? req.query.uri.join("/")
        : typeof req.query.uri === "string"
        ? req.query.uri
        : ""
    if (!uri) {
        console.error("No URI to resolve.")
        res.status(404).end()
    } else if (uri.startsWith(UUID_PREFIX)) {
        res.status(308)
            .setHeader("location", `http://phylopic.org/name/${uri.slice(UUID_PREFIX.length)}`)
            .end()
    } else if (uri.startsWith(NAMEBANK_PREFIX)) {
        res.status(308)
            .setHeader(
                "location",
                `http://ubio.org/browser/details.php?namebankID=${encodeURIComponent(
                    uri.slice(NAMEBANK_PREFIX.length),
                )}`,
            )
            .end()
    } else if (uri.startsWith(LSID_PREFIX)) {
        res.status(308)
            .setHeader("location", `http://www.lsid.info/resolver/?lsid=${encodeURIComponent(uri)}`)
            .end()
    } else if (uri.startsWith("http://") || uri.startsWith("https://")) {
        res.status(308).setHeader("location", uri).end()
    } else {
        console.warn("Unrecognized URI pattern:", uri)
        res.status(404).end()
    }
}
export default resolve
