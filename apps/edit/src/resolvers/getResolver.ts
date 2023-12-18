import { Authority, Namespace } from "@phylopic/utils"
import { Resolver } from "./Resolver"
import resolveGBIF from "./namespaces/resolveGBIF"
import resolveOTOL from "./namespaces/resolveOTOL"
import resolvePBDB from "./namespaces/resolvePBDB"
import resolvePhyloPic from "./namespaces/resolvePhyloPic"
const getResolver = (authority: Authority, namespace: Namespace): Resolver | null => {
    if (authority === "gbif.org" && namespace === "species") {
        return resolveGBIF
    }
    if (authority === "opentreeoflife.org" && namespace === "taxonomy") {
        return resolveOTOL
    }
    if (authority === "paleobiodb.org" && namespace === "txn") {
        return resolvePBDB
    }
    if (authority === "phylopic.org" && namespace === "nodes") {
        return resolvePhyloPic
    }
    return null
}
export default getResolver
